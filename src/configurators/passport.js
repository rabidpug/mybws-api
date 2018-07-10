export default function passportConfig ( { get, } ) {
  const passport = require( 'passport' )

  passport.use( get( 'localStrategy' ) )

  passport.use( get( 'googleStrategy' ) )

  return passport
}
