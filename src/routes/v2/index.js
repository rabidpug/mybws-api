export default function v2Route ( { get, }, config ) {
  const { ApolloServer, } = get( 'gql' )
  const { typeDefs: resolverTypeDefs, resolvers, } = get( 'resolvers' )
  const typeDefs = [
    get( 'User' ).gql,
    get( 'Store' ).gql,
    get( 'Article' ).gql,
    get( 'Planogram' ).gql,
    resolverTypeDefs,
  ]

  const server = new ApolloServer( {
    async context ( { req = {}, } ) {
      if ( req.headers ) {
        const { authorization: authToken, refreshtoken: refreshToken, } = req.headers

        if ( authToken ) {
          let jwtPayload = {}

          try {
            jwtPayload = get( 'jwt' ).verify( authToken.replace( 'JWT ', '' ), config.localStrategy.secretOrKey || 'secret' )
          } catch (e) {} //eslint-disable-line

          const expirationDate = new Date( jwtPayload.exp * 1000 )

          const { _id, } = jwtPayload
          const search = expirationDate < new Date() ? { refreshToken, } : { _id, }
          const user = await get( 'userService' ).signUser( search )

          if ( !user ) throw new Error( 'No credentials context' )
          return { user, }
        } else throw new Error( 'No credentials context' )
      }
    },
    resolvers,
    subscriptions: {
      async onConnect ( connectionParams ) {
        const { authToken, refreshToken, } = connectionParams

        if ( authToken ) {
          let jwtPayload = {}

          try {
            jwtPayload = get( 'jwt' ).verify( authToken.replace( 'JWT ', '' ), config.localStrategy.secretOrKey || 'secret' )
          } catch (e) {} //eslint-disable-line

          const expirationDate = new Date( jwtPayload.exp * 1000 )

          const { _id, } = jwtPayload
          const search = expirationDate < new Date() ? { refreshToken, } : { _id, }
          const user = await get( 'userService' ).signUser( search )

          return { user, }
        }

        throw new Error( 'No credentials subscription' )
      },
    },
    typeDefs,
  } )
  const app = get( 'app' )

  // app.use( '/v2', get( 'passport' ).authenticate( 'jwt', { session: false, } ) )

  server.applyMiddleware( {
    app,
    path: '/v2',
  } )

  server.installSubscriptionHandlers( get( 'server' ) )

  return {
    resolvers,
    server,
    typeDefs,
  }
}
