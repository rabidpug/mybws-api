const routes = [
  { v1Route: require( './v1' ), },
  { userRoute: require( './v1/user' ), },
  { rangeRoute: require( './v1/range' ), },
  { articleRoute: require( './v1/article' ), },
  { pogRoute: require( './v1/pog' ), },
  { googleRoute: require( './v1/google' ), },
  { authRoute: require( './auth' ), },
  {
    config  : true,
    invoke  : true,
    v2Route : require( './v2' ),
  },
  { resolvers: require( './v2/resolvers' ), },
]

export default routes
