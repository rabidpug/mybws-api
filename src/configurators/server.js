export default function serverConfig ( { get, }, { port, name, } ) {
  const app = get( 'app' )

  const server = get( 'http' ).createServer( app )

  server.listen( port, () => get( 'log' ).info( `${name} server is running on port - ${port}` ) )

  return server
}
