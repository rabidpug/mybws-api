export default function localStrategyConfig ( { get, }, config ) {
  const { Strategy, } = require( 'passport-jwt' )

  const { promiseErrorWrap, } = get( 'utilibelt' )
  const { resign, } = get( 'userController' )

  return new Strategy( config, promiseErrorWrap( resign ) )
}
