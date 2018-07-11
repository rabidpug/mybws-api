export default function appConfig ( { get, } ) {
  const { loggerMiddleware, } = require( '../lib/logMaker' )
  /* eslint-disable no-unused-vars */
  const errorHandler = (
    err, req, res, next
  ) => {
    /* eslint-enable no-unused-vars */
    if ( err.isControlled ) {
      req.log.add( 'warn', err.message )

      return res.json( { error: err.message, } )
    }
    if ( !err.isBoom ) {
      req.log.add( 'error', `Unhandled error! ${err.message}` )

      req.log.add( 'error', err.stack )

      err = get( 'boom' ).boomify( err )
    }

    req.error = err.output.payload

    return res.status( err.output.statusCode ).json( err.output.payload )
  }

  const express = get( 'express' )
  const app = express()
  const bodyParser = get( 'bodyParser' )

  app.enable( 'trust proxy' )

  app.use( require( 'cors' )() )

  app.use( loggerMiddleware )

  app.use( get( 'compression' )() )

  app.use( bodyParser.json() )

  app.use( bodyParser.urlencoded( { extended: 'false', } ) )

  app.use( get( 'passport' ).initialize() )

  // app.use( get( 'morgan' )( ':method#$%:status#$%:error#$%:response-time[0]#$%:url#$%:user#$%:body#$%:log#$%:user-agent', { stream: get( 'log' ).stream, } ) )

  app.use( '/auth', get( 'authRoute' ) )

  app.use( errorHandler )

  return app
}
