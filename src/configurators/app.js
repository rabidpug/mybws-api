export default function appConfig ( { get, }, { server, } ) {
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

  const isProd = server.environment === 'production'
  const express = get( 'express' )
  const path = get( 'path' )
  const app = express()
  const bodyParser = get( 'bodyParser' )

  app.enable( 'trust proxy' )

  app.use( require( 'cors' )() )

  app.use( loggerMiddleware )

  app.use( get( 'compression' )() )

  app.use( bodyParser.json() )

  app.use( bodyParser.urlencoded( { extended: 'false', } ) )

  app.use( get( 'passport' ).initialize() )

  app.use( get( 'morgan' )( ':method#$%:status#$%:error#$%:response-time[0]#$%:url#$%:user#$%:body#$%:log#$%:user-agent', { stream: get( 'log' ).stream, } ) )

  // app.use( ( req, res, next ) => {
  //   req.io = get( 'socket' )

  //   next()
  // } )

  app.use( '/v1', get( 'v1Route' ) )

  app.use( '/auth', get( 'authRoute' ) )

  if ( isProd ) {
    app.use( get( 'favicon' )( path.join( server.path, 'dist', 'favicon.ico' ) ) )

    app.use( express.static( path.join( server.path, 'dist' ) ) )

    app.get( '*', ( req, res ) => {
      res.sendFile( path.join( server.path, 'dist', 'index.html' ) )
    } )
  }

  app.use( errorHandler )

  return app
}
