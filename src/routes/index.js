const routes = [
  { authRoute: require( './auth' ), },
  {
    config  : true,
    invoke  : true,
    v1Route : require( './v1' ),
  },
  { resolvers: require( './v1/resolvers' ), },
]

export default routes
