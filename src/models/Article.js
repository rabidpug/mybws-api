export default function articleModel ( { get, } ) {
  const mongoose = get( 'mongoose' )
  const { Schema, } = mongoose
  const ArticleGql = get( 'gql' ).gql`
  type Price {
    ea: Float
    mpk: Float
    car: Float
  }
  type District {
    dc: [Int]
    dsd: [String]
    performance: Int
    storeCount: Int
    price: Price
  }
  type Organisation {
    nsw: District
    sa: District
    nt: District
    vic: District
    tas: District
    qld: District
    wa: District
  }
  type Cass {
    ea: Int
    mpk: Int
    car: Int
  }
type Article {
  id: Int
  bws: Organisation
  dms: Organisation
  category: String
  description: String
  group: String
  segment: String
  subcategory: String
  cass: Cass
}
`

  const ArticleSchema = new Schema( {
    _id : { type: Number, },
    bws : {
      nsw: {
        dc: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ Number, ],
        },
        dsd: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ String, ],
        },
        performance: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
        price: {
          car: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          ea: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          mpk: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
        },
        storeCount: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
      },
      nt: {
        dc: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ Number, ],
        },
        dsd: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ String, ],
        },
        performance: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
        price: {
          car: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          ea: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          mpk: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
        },
        storeCount: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
      },
      qld: {
        dc: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ Number, ],
        },
        dsd: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ String, ],
        },
        performance: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
        price: {
          car: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          ea: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          mpk: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
        },
        storeCount: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
      },
      sa: {
        dc: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ Number, ],
        },
        dsd: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ String, ],
        },
        performance: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
        price: {
          car: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          ea: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          mpk: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
        },
        storeCount: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
      },
      tas: {
        dc: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ Number, ],
        },
        dsd: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ String, ],
        },
        performance: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
        price: {
          car: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          ea: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          mpk: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
        },
        storeCount: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
      },
      vic: {
        dc: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ Number, ],
        },
        dsd: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ String, ],
        },
        performance: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
        price: {
          car: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          ea: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          mpk: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
        },
        storeCount: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
      },
      wa: {
        dc: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ Number, ],
        },
        dsd: {
          index    : true,
          required : false,
          sparse   : true,
          type     : [ String, ],
        },
        performance: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
        price: {
          car: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          ea: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
          mpk: {
            index    : true,
            required : false,
            sparse   : true,
            type     : Number,
          },
        },
        storeCount: {
          index    : true,
          required : false,
          sparse   : true,
          type     : Number,
        },
      },
    },
    cass: {
      car: {
        index    : true,
        required : false,
        sparse   : true,
        trim     : true,
        type     : Number,
        unique   : true,
      },
      ea: {
        index    : true,
        required : false,
        sparse   : true,
        trim     : true,
        type     : Number,
        unique   : true,
      },
      mpk: {
        index    : true,
        required : false,
        sparse   : true,
        trim     : true,
        type     : Number,
        unique   : true,
      },
    },
    category: {
      index    : true,
      required : true,
      type     : String,
    },
    description: {
      index    : true,
      required : true,
      type     : String,
    },
    dms: {
      nsw: {
        dc          : { type: [ Number, ], },
        dsd         : { type: [ String, ], },
        performance : { type: Number, },
        price       : {
          car : { type: Number, },
          ea  : { type: Number, },
          mpk : { type: Number, },
        },
        storeCount: { type: Number, },
      },
      nt: {
        dc          : { type: [ Number, ], },
        dsd         : { type: [ String, ], },
        performance : { type: Number, },
        price       : {
          car : { type: Number, },
          ea  : { type: Number, },
          mpk : { type: Number, },
        },
        storeCount: { type: Number, },
      },
      qld: {
        dc          : { type: [ Number, ], },
        dsd         : { type: [ String, ], },
        performance : { type: Number, },
        price       : {
          car : { type: Number, },
          ea  : { type: Number, },
          mpk : { type: Number, },
        },
        storeCount: { type: Number, },
      },
      sa: {
        dc          : { type: [ Number, ], },
        dsd         : { type: [ String, ], },
        performance : { type: Number, },
        price       : {
          car : { type: Number, },
          ea  : { type: Number, },
          mpk : { type: Number, },
        },
        storeCount: { type: Number, },
      },
      tas: {
        dc          : { type: [ Number, ], },
        dsd         : { type: [ String, ], },
        performance : { type: Number, },
        price       : {
          car : { type: Number, },
          ea  : { type: Number, },
          mpk : { type: Number, },
        },
        storeCount: { type: Number, },
      },
      vic: {
        dc          : { type: [ Number, ], },
        dsd         : { type: [ String, ], },
        performance : { type: Number, },
        price       : {
          car : { type: Number, },
          ea  : { type: Number, },
          mpk : { type: Number, },
        },
        storeCount: { type: Number, },
      },
      wa: {
        dc          : { type: [ Number, ], },
        dsd         : { type: [ String, ], },
        performance : { type: Number, },
        price       : {
          car : { type: Number, },
          ea  : { type: Number, },
          mpk : { type: Number, },
        },
        storeCount: { type: Number, },
      },
    },
    group: {
      index    : true,
      required : true,
      type     : String,
    },
    segment: {
      index    : true,
      required : true,
      type     : String,
    },
    subcategory: {
      index    : true,
      required : true,
      type     : String,
    },
  },
                                    {
                                      toJSON   : { virtuals: true, },
                                      toObject : { virtuals: true, },
                                    } )

  ArticleSchema.index( {
    category    : 'text',
    description : 'text',
    segment     : 'text',
    subcategory : 'text',
  } )

  const Article = mongoose.model( 'Article', ArticleSchema )

  Article.gql = ArticleGql

  return Article
}
