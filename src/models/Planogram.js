export default function planogramModel ( { get, } ) {
  const mongoose = get( 'mongoose' )
  const { Schema, } = mongoose

  const PlanogramGql = get( 'gql' ).gql`
  type PogArticle {
    article: Int
    notes: String
    updated: Float
  }
  type PogRange {
    cart: [PogArticle]
    onshow: [PogArticle]
  }
  type SpaceMeasure {
    available: Float
    used: Float
  }
  type Planogram {
    id: String
    articles: PogRange
    category: String
    cluster: String
    district: String
    equipment: String
    linear: SpaceMeasure
    organisation: String
    parent: Boolean
    rangecode: String
    sectionID: String
    size: Float
    standard: Boolean
    stores: [Int]
    variation: String
  }
`

  const PlanogramSchema = new Schema( {
    _id      : { type: String, },
    articles : {
      cart: {
        index : true,
        type  : [
          {
            article: {
              index : true,
              ref   : 'Article',
              type  : Number,
            },
            notes   : String,
            updated : Number,
          },
        ],
      },
      onshow: {
        type: [
          {
            article: {
              index : true,
              ref   : 'Article',
              type  : Number,
            },
            notes   : String,
            updated : Number,
          },
        ],
      },
    },
    category: {
      index    : true,
      required : true,
      type     : String,
    },
    cluster: {
      index    : true,
      required : false,
      type     : String,
    },
    district: {
      index    : true,
      required : true,
      type     : String,
    },
    equipment: {
      required : true,
      type     : String,
    },
    linear: {
      available: {
        required : true,
        type     : Number,
      },
      used: {
        required : true,
        type     : Number,
      },
    },
    organisation: {
      index    : true,
      required : true,
      type     : String,
    },
    parent: {
      required : true,
      type     : Boolean,
    },
    rangecode: {
      index    : true,
      required : false,
      type     : String,
    },
    sectionID: {
      index    : true,
      required : true,
      sparse   : true,
      trim     : true,
      type     : String,
      unique   : true,
    },
    size: {
      required : true,
      type     : Number,
    },
    standard: {
      index    : true,
      required : true,
      type     : Boolean,
    },
    stores: {
      index : true,
      type  : [
        {
          ref  : 'Store',
          type : Number,
        },
      ],
    },
    variation: {
      required : false,
      type     : String,
    },
  },
                                      {
                                        toJSON   : { virtuals: true, },
                                        toObject : { virtuals: true, },
                                      } )

  const Planogram = mongoose.model( 'Planogram', PlanogramSchema )

  Planogram.gql = PlanogramGql

  return Planogram
}
