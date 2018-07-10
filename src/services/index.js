const services = [
  {
    config       : true,
    dependencies : [
      'log',
      'User',
      'Store',
      'boom',
      'jwt',
      'bcrypt',
    ],
    userService: require( './user' ),
  },
  {
    dependencies: [
      'log',
      'mongoose',
      'boom',
    ],
    rangeService: require( './range' ),
  },
  {
    dependencies: [
      'log',
      'joi',
      'boom',
      'mongoose',
      'validations',
      'Store',
    ],
    validateService: require( './validate' ),
  },
]

export default services
