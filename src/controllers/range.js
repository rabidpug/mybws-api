import { get, } from 'express-locator'

const Instance = get( 'Instance' )

export default class RangeController extends Instance {
  search = async ( {
    store: storeID,
    groupFilters,
    statusFilters,
    descendingSort,
    sort,
    exactSearch,
    search: $search,
  } ) => {
    const conf = {
      fields: {
        _id   : 1,
        group : 1,
      },
      query : { group: { $ne: 'Exclude', }, },
      sort  : {},
    }

    const ascdesc = descendingSort ? -1 : 1

    if ( $search && exactSearch && isNaN( $search ) ) {
      conf.fields.score = { $meta: 'textScore', }

      conf.sort.score = { $meta: 'textScore', }

      conf.query.$text = { $search, }
    } else if ( $search && isNaN( $search ) ) {
      const $regex = `^.*${$search
        .split( '' )
        .filter( v => v !== ' ' )
        .map( v => `${v}+.*` )
        .join( '' )}$`

      conf.query.$or = [
        ...conf.query.$or || [],
        ...[
          'description',
          'group',
          'category',
          'subcategory',
          'segment',
        ].map( field => ( {
          [field]: {
            $options: 'i',
            $regex,
          },
        } ) ),
      ]

      conf.fields = {
        ...conf.fields,
        category    : 1,
        description : 1,
        segment     : 1,
        subcategory : 1,
      }
    } else if ( $search ) {
      conf.query.$or = [
        ...conf.query.$or || [],
        { 'cass.ea': +$search, },
        { 'cass.mpk': +$search, },
        { 'cass.car': +$search, },
      ]

      conf.fields.cass = 1
    }
    const $in = groupFilters
    const hasStatusFilters = statusFilters.length

    if ( !( $search && !$in.length ) ) conf.query.group = { $in, }

    if ( !$search && ( !hasStatusFilters || !$in.length ) ) return []
    else {
      const store = await this.Store.findById( storeID )

      if ( store ) {
        const { organisation, district, } = store
        const orgdist = `${organisation}.${district}`

        if ( sort.includes( 'group' ) ) conf.sort.group = ascdesc
        if ( sort.includes( 'price' ) ) {
          conf.sort[`${orgdist}.price.ea`] = ascdesc

          conf.fields[`${orgdist}.price.ea`] = 1
        }
        if ( sort.includes( 'performance' ) ) {
          conf.sort[`${orgdist}.performance`] = ascdesc

          conf.fields[`${orgdist}.performance`] = 1
        }
        if ( sort.includes( 'description' ) ) {
          conf.sort.description = ascdesc

          conf.fields.description = 1
        }

        conf.fields[orgdist] = 1

        const identity = {
          orgdist,
          store,
        }

        const notavailable = await this.notAvailable( conf, identity )
        const [
          ranged = [],
          request = [],
          allpromo = [],
        ] = await this.ranged( conf, identity )
        const allavail = await this.available( conf, identity )

        const available = allavail.filter( article => !ranged.includes( article ) && !request.includes( article ) && !allpromo.includes( article ) )
        const promo = allpromo.filter( article => !ranged.includes( article ) && !request.includes( article ) )
        const override = $search && !hasStatusFilters
        const arts = [
          ...statusFilters.includes( 'Pog Range' ) || override ? ranged : [],
          ...statusFilters.includes( 'Promo/Season' ) || override ? promo : [],
          ...statusFilters.includes( 'Customer 1st' ) || override ? request : [],
          ...statusFilters.includes( 'Available' ) || override ? available : [],
          ...statusFilters.includes( 'Not Available' ) || override ? notavailable : [],
        ].filter( ( v, i, a ) => a.indexOf( v ) === i )

        conf.query._id = { $in: arts, }

        const { score, } = conf.fields

        conf.fields = { _id: 1, }

        if ( score ) conf.fields.score = score
        const articles = await this.Article.find( conf.query, conf.fields ).sort( conf.sort )

        return articles.map( art => art._id )
      } else throw new Error( 'The provided store number does not exist' )
    }
  }

  available = ( conf, identity ) => {
    const query = { ...conf.query, }

    if ( identity.store.organisation === 'bws' && identity.store.dcs.includes( 3985 ) ) identity.store.dcs.splice( identity.store.dcs.indexOf( 3985 ), 1 )

    query.$and = [
      ...query.$and || [],
      {
        $or: [
          { [`${identity.orgdist}.dc`]: { $in: identity.store.dcs, }, },
          { [`${identity.orgdist}.dsd`]: { $ne: null, }, },
        ],
      },
      {
        $or: [
          { [`${identity.orgdist}.price.ea`]: { $ne: null, }, },
          { [`${identity.orgdist}.price.mpk`]: { $ne: null, }, },
          { [`${identity.orgdist}.price.car`]: { $ne: null, }, },
        ],
      },
      { [`${identity.orgdist}.storeCount`]: { $gt: 0, }, },
    ]

    return this.Article.distinct( '_id', query )
  }

  notAvailable = ( conf, identity ) => {
    if ( identity.store.organisation === 'bws' && identity.store.dcs.includes( 3985 ) ) identity.store.dcs.splice( identity.store.dcs.indexOf( 3985 ), 1 )
    const query = {
      $or: [
        {
          $and: [
            { [`${identity.orgdist}.dc`]: { $nin: identity.store.dcs, }, },
            { [`${identity.orgdist}.dsd`]: null, },
          ],
        },
        {
          $and: [
            { [`${identity.orgdist}.price.ea`]: null, },
            { [`${identity.orgdist}.price.mpk`]: null, },
            { [`${identity.orgdist}.price.car`]: null, },
          ],
        },
        { [`${identity.orgdist}.storeCount`]: { $lte: 0, }, },
        { [`${identity.orgdist}.storeCount`]: null, },
      ],
    }

    return this.Article.distinct( '_id', conf.query ).where( query )
  }

  ranged = ( conf, identity, _id ) =>
    new Promise( ( resolve, reject ) => {
      this.Planogram.find( { stores: identity.store._id, } )
        .populate( {
          match  : conf.query,
          path   : 'n.articles.onshow.article',
          select : '_id category group',
        } )
        .then( pogs => {
          let ranged = []
          let request = []
          let promo = []

          pogs.forEach( pog => {
            if ( pog.articles.onshow ) {
              if ( pog.category.includes( 'Promo Store' ) ) {
                request = [
                  ...request,
                  ...pog.articles.onshow
                    .map( articlePosition => articlePosition.article )
                    .filter( art => !_id || art === +_id ),
                ]
              } else if ( pog.standard ) {
                ranged = [
                  ...ranged,
                  ...pog.articles.onshow
                    .map( articlePosition => articlePosition.article )
                    .filter( art => !_id || art === +_id ),
                ]
              } else {
                promo = [
                  ...promo,
                  ...pog.articles.onshow
                    .map( articlePosition => articlePosition.article )
                    .filter( art => !_id || art === +_id ),
                ]
              }
            }
          } )

          resolve( [
            ranged,
            request,
            promo,
          ] )
        } )
        .catch( e => reject( e ) )
    } )
}
