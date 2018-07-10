export default function userInjector ( req, res, next ) {
  const { user, } = req

  if ( user ) {
    const { json, } = res

    res.json = function ( obj ) {
      const data = obj instanceof Buffer ? obj.toJSON() : obj || {}

      if ( !data.user ) data.user = {}
      if ( !data.user.token ) data.user.token = user.token
      if ( !data.user.refreshToken ) data.user.refreshToken = user.refreshToken

      json.call( this, data )
    }
  }

  next()
}
