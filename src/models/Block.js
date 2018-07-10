export default function blockModel ( { get, } ) {
  const mongoose = get( 'mongoose' )
  const { Schema, } = mongoose

  const BlockSchema = new Schema( {
    allowpath   : { type: String, },
    allowvalues : { type: Schema.Types.Mixed, },
    articles    : [
      {
        ref  : 'Article',
        type : Number,
      },
    ],
    message: {
      required : true,
      type     : String,
    },
  } )

  return mongoose.model( 'Block', BlockSchema )
}
