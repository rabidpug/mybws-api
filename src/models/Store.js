export default function storeModel ( { get, } ) {
  const mongoose = get( 'mongoose' )
  const { Schema, } = mongoose
  const Storegql = get( 'gql' ).gql`
  type Contact {
      email: String
      name: String
      phone: String
    }
    type Restrictions {
      mandatory: String
      voluntary: String
    }
    type Tradinghours {
      friday: String
      monday: String
      saturday: String
      sunday: String
      thursday: String
      tuesday: String
      wednesday: String
    }
type Store {
    id: Int
    address: String
    area: String
    areamanager: Contact
    avgsales: Int
    buildingarea: Int
    cellarmasters: Boolean
    centrestore: String
    channel: String
    commencedtrade: String
    company: String
    dcs: [ Int ]
    district: String
    email: String
    express: Boolean
    fax: String
    itsystem: String
    latitude: Float
    license: String
    longitude: Float
    manager: String
    manageremail: String
    metrostore: Boolean
    name: String
    organisation: String
    phone: String
    pickup: Boolean
    pos: String
    postcode: Int
    refitmanager: Contact
    region: String
    resortstore: Boolean
    restrictions: Restrictions
    statemanager: Contact
    statesupport: Contact
    store: Int
    suburb: String
    tradearea: Int
    tradinghours: Tradinghours
    wowgroup: String
  }
  `

  const StoreSchema = new Schema( {
    _id     : Number,
    address : String,
    area    : {
      index : true,
      type  : String,
    },
    areamanager: {
      email : String,
      name  : String,
      phone : String,
    },
    avgsales       : Number,
    buildingarea   : Number,
    cellarmasters  : Boolean,
    centrestore    : String,
    channel        : String,
    commencedtrade : String,
    company        : String,
    dcs            : [ Number, ],
    district       : {
      index : true,
      type  : String,
    },
    email: {
      index : true,
      type  : String,
    },
    express      : Boolean,
    fax          : String,
    itsystem     : String,
    latitude     : Number,
    license      : String,
    longitude    : Number,
    manager      : String,
    manageremail : String,
    metrostore   : Boolean,
    name         : {
      index : true,
      type  : String,
    },
    organisation: {
      index : true,
      type  : String,
    },
    phone        : String,
    pickup       : Boolean,
    pos          : String,
    postcode     : Number,
    refitmanager : {
      email : String,
      name  : String,
      phone : String,
    },
    region       : String,
    resortstore  : Boolean,
    restrictions : {
      mandatory : String,
      voluntary : String,
    },
    statemanager: {
      email : String,
      name  : String,
      phone : String,
    },
    statesupport: {
      email : String,
      name  : String,
      phone : String,
    },
    store: {
      index    : true,
      required : true,
      sparse   : true,
      trim     : true,
      type     : Number,
      unique   : true,
    },
    suburb       : String,
    tradearea    : Number,
    tradinghours : {
      friday    : String,
      monday    : String,
      saturday  : String,
      sunday    : String,
      thursday  : String,
      tuesday   : String,
      wednesday : String,
    },
    wowgroup: String,
  },
                                  {
                                    toJSON   : { virtuals: true, },
                                    toObject : { virtuals: true, },
                                  } )

  const Store = mongoose.model( 'Store', StoreSchema )

  Store.gql = Storegql

  return Store
}
