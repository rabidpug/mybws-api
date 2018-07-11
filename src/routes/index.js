const routes = [
  { authRoute: require( './auth' ), },
  {
    config  : true,
    invoke  : true,
    v2Route : require( './v2' ),
  },
  { resolvers: require( './v2/resolvers' ), },
]

export default routes
