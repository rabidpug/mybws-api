export default function limitModel ( { get, } ) {
  const mongoose = get( 'mongoose' )
  const { Schema, } = mongoose

  const LimitSchema = new Schema( {
    exceptions: [
      {
        ref  : 'Store',
        type : Schema.Types.ObjectId,
      },
    ],
    group: {
      index    : true,
      required : true,
      type     : String,
      unique   : true,
    },
    limit: {
      required : true,
      type     : Number,
    },
  } )

  return mongoose.model( 'Limit', LimitSchema )
}
