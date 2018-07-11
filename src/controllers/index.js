const controllers = [
  {
    dependencies  : [ 'Planogram', ],
    pogController : require( './pog' ),
  },
  {
    dependencies: [
      'log',
      'boom',
      'mongoose',
      'webpush',
      'jwt',
      'userService',
    ],
    userController: require( './user' ),
  },
  {
    dependencies: [
      'log',
      'boom',
      'Store',
      'Article',
      'Planogram',
      'Block',
      'rangeService',
    ],
    rangeController: require( './range' ),
  },
  {
    articleController : require( './article' ),
    dependencies      : [
      'log',
      'boom',
      'Article',
      'Block',
    ],
  },
  {
    dependencies: [
      'log',
      'boom',
      'validateService',
    ],
    validateController: require( './validate' ),
  },
]

export default controllers
