export default function morganConfig () {
  const morgan = require( 'morgan' )

  morgan.token( 'error', req => req.error ? req.error.message : '' )

  morgan.token( 'user', req => req.user ? JSON.stringify( req.user ) : '' )

  morgan.token( 'body', req => req.body ? JSON.stringify( req.body ) : '' )

  morgan.token( 'log', req => req.log ? JSON.stringify( req.log.logs ) : '' )

  return morgan
}
