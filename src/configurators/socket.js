export default function socketConfig ( { get, }, config ) {
  const { Logger, } = require( '../lib/logMaker' )

  const io = require( 'socket.io' )( get( 'server' ), config.socket )

  const jwt = get( 'jwt' )
  const log = get( 'log' )

  function loggerMiddleware ( socket, next ) {
    socket.log = new Logger()

    socket.write = log.stream.write

    socket.stream = function socketStream () {
      this.write( this.log.getAll() )
    }

    socket.stream.bind( socket )

    socket.log.set( { handshake: socket.handshake, } )

    next()
  }

  async function authorize ( socket, next ) {
    const { query: { token, refreshToken, }, } = socket.handshake

    try {
      const payload = jwt.verify( token.replace( 'JWT ', '' ), config.localStrategy.secretOrKey || 'secret', { ignoreExpiration: true, } )
      const expirationDate = new Date( payload.exp * 1000 )
      const { _id, } = payload

      const search = expirationDate < new Date() ? { refreshToken, } : { _id, }
      const user = await get( 'userService' ).signUser( search, null, socket )

      if ( !user ) throw new Error( 'Authorization failed' )

      socket.user = user

      socket.log.set( { user, } )

      return next()
    } catch ( e ) {
      socket.log.add( 'warn', 'User failed to be authenticated.' )

      socket.stream()

      return next( new Error( 'Authentication Error' ) )
    }
  }

  async function connectUser ( socket ) {
    const activeSockets = io.sockets.server.eio.clients

    if ( socket.user ) {
      socket.user.socketid = [
        ...socket.user.socketid.filter( id => activeSockets[id] ),
        socket.id,
      ]

      await socket.user.save( socket )

      socket.log.add( 'info', `session initiated successfully` )
    }

    socket.on( 'disconnect', async () => {
      socket.user = await get( 'userService' ).refreshUser( socket.user._id )

      if ( socket.user && socket.user.socketid ) {
        const activeSockets = io.sockets.server.eio.clients

        socket.user.socketid = socket.user.socketid.filter( session => session !== socket.id && activeSockets[session] )

        socket.user.save( socket )
      }

      socket.log.add( 'info', 'session ended' )

      socket.stream()
    } )

    socket.on( 'error', e => {
      socket.log.add( 'error', `An error ocurred - ${e.message}` )

      socket.stream()
    } )
  }

  io.use( ( socket, next ) => loggerMiddleware( socket, next ) )

  io.use( ( socket, next ) => authorize( socket, next ) )

  io.on( 'connection', socket => connectUser( socket ) )

  return io
}
