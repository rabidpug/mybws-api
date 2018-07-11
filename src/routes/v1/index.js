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
        try {
          const { authorization: authToken, } = req.headers

          if ( !authToken ) throw new Error( 'No auth token' )
          const jwtPayload = get( 'jwt' ).verify( authToken.replace( 'JWT ', '' ),
                                                  config.localStrategy.secretOrKey || 'secret' )

          const { _id, } = jwtPayload || {}
          const user = await get( 'userService' ).signUser( { _id, } )

          if ( user ) return { user, }
          throw new Error( 'No user' )
        } catch ( e ) {
          throw new Error( 'User not logged in' )
        }
      }
    },
    resolvers,
    typeDefs,
  } )
  const app = get( 'app' )

  server.applyMiddleware( {
    app,
    path: '/v1',
  } )

  server.installSubscriptionHandlers( get( 'server' ) )

  return {
    resolvers,
    server,
    typeDefs,
  }
}
