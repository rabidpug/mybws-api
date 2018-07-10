const configurators = [
  { log: require( './log' ), },
  { joi: require( './joi' ), },
  { passport: require( './passport' ), },
  { googleStrategy: require( './googleStrategy' ), },
  { localStrategy: require( './localStrategy' ), },
  { webpush: require( './webpush' ), },
  { morgan: require( './morgan' ), },
  { mongoose: require( './mongoose' ), },
  { validations: require( './validations' ), },
  {
    app    : require( './app' ),
    config : true,
  },
  // {
  //   config : true,
  //   socket : require( './socket' ),
  // },
  { server: require( './server' ), },
]

export default configurators
