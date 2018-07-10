export default function googleStrategyConfig ( { get, }, config ) {
  const { OAuth2Strategy, } = require( 'passport-google-oauth' )

  const { promiseErrorWrap, } = get( 'utilibelt' )
  const { sign, } = get( 'userController' )

  return new OAuth2Strategy( config, promiseErrorWrap( sign ) )
}
