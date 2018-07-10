export default function groupModel ( { get, } ) {
  const mongoose = get( 'mongoose' )
  const { Schema, } = mongoose

  const GroupSchema = new Schema( {
    field: {
      required : true,
      type     : String,
    },
    group: {
      required : true,
      type     : String,
    },
    priority: {
      required : true,
      type     : Number,
    },
    value: {
      required : true,
      type     : Schema.Types.Mixed,
    },
  } )

  return mongoose.model( 'Group', GroupSchema )
}
