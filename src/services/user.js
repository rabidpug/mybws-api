import { get, } from 'express-locator'

const Instance = get( 'Instance' )

export default class UserService extends Instance {
  constructUser ( profile, req ) {
    const allowedDomains = [
      'woolworths.com.au',
      'bws.com.au',
      'edg.com.au',
      'danmurphys.com.au',
      'jcuneo.com',
    ]
    const {
      id: googleid,
      displayName,
      photos: pics,
      emails: mail,
      _json: { domain, },
    } = profile

    if ( allowedDomains.includes( domain ) ) {
      const photos = pics.reduce( ( p, n, i ) => [
        {
          selected : i === 0,
          value    : n.value.replace( 'sz=50', 'sz=200' ),
        },
        ...p,
      ],
                                  [] )
      const names = [
        {
          selected : true,
          value    : displayName,
        },
      ]
      const emails = mail.reduce( ( p, n, i ) => [
        {
          selected : i === 0,
          value    : n.value,
        },
        ...p,
      ],
                                  [] )
      const isStore = !isNaN( emails[0].value.slice( 0, 4 ) )
      const roles = [
        {
          selected : true,
          value    : 'Store Team',
        },
      ]

      req.log.add( 'info', 'User profile constructed from Google result' )

      return {
        _id: googleid,
        emails,
        isStore,
        names,
        photos,
        roles,
      }
    } else throw new this.ControlledError( 'Domain not allowed' )
  }

  async refreshUser ( _id ) {
    return this.User.findById( _id ).populate( 'stores.value' )
  }

  async signUser ( search, newUser, req ) {
    const existUser = await this.User.findOne( search )

    const user = existUser || newUser && new this.User( newUser )

    if ( user ) {
      const { _id, } = user

      const token = `JWT ${this.jwt.sign( { _id, }, this.config.localStrategy.secretOrKey || 'secret', { expiresIn: 900, } )}`
      const refreshToken = `JWT ${this.jwt.sign( { _id, }, this.config.localStrategy.secretOrKey || 'secret', { expiresIn: 10800, } )}`
      const checkForUpdates = existUser && newUser
      let hasUpdates = false

      if ( checkForUpdates ) {
        const [
          emails,
          names,
          photos,
        ] = [
          'emails',
          'names',
          'photos',
        ].map( key =>
          newUser[key].filter( v => user[key].every( a => a.value !== v.value ) ) )
        const noSelected = v => {
          v.selected = false

          return v
        }

        user.emails = [
          ...user.emails,
          ...emails.map( noSelected ),
        ]

        user.names = [
          ...user.names,
          ...names.map( noSelected ),
        ]

        user.photos = [
          ...user.photos,
          ...photos.map( noSelected ),
        ]

        hasUpdates = emails.length + names.length + photos.length > 0
      }

      await user.save( req )

      user.refreshToken = refreshToken

      user.token = token

      req &&
        req.log.add( 'info',
                     existUser
                       ? `Existing user reauthenticated${hasUpdates ? ' and updated from Google profile' : ''}`
                       : 'New user created' )

      return user
    }
    return false
  }

  async updateProfile ( body, req ) {
    const { user, key, value, type, } = body

    if ( type === 'delete' ) {
      user[key] = user[key].filter( item => !( item.value === value || item.value._id === value ) )

      if ( user[key][0] ) user[key][0].selected = true
    } else {
      user[key].map( item => {
        item.selected = item.value === value || item.value._id === value

        return item
      } )
    }

    if ( type === 'add' ) {
      user[key].push( {
        selected: true,
        value,
      } )
    }

    await user.save( req )

    req.log.add( 'info', `Actioned ${type} on ${key} ${value}` )

    return true
  }
}
