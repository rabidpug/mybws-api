export default function mongooseConfig ( { get, }, { host, port, name, } ) {
  const mongoose = require( 'mongoose' )

  const log = get( 'log' )

  mongoose.Promise = global.Promise

  mongoose.connect( `mongodb://${host}:${port}/${name}` )

  const { connection, } = mongoose

  connection.on( 'connected', () => log.info( 'Database Connection was Successful' ) )

  connection.on( 'error', err => log.error( `Database Connection Failed${err}` ) )

  connection.on( 'disconnected', () => log.info( 'Database Connection Disconnected' ) )

  process.on( 'SIGINT', () => {
    connection.close()

    log.info( 'Database Connection closed due to NodeJs process termination' )

    process.exit( 0 )
  } )

  return mongoose
}
