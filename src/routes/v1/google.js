export default function googleRoute ( { get, } ) {
  const { redirect, } = get( 'userController' )

  const router = get( 'express' ).Router()

  router.get( '/',
              get( 'passport' ).authenticate( 'google', {
                scope: [
                  'https://www.googleapis.com/auth/plus.login',
                  'https://www.googleapis.com/auth/plus.profile.emails.read',
                ],
                session: false,
              } ) )

  router.get( '/callback',
              get( 'passport' ).authenticate( 'google', {
                failureRedirect : '/signin#failed',
                session         : false,
              } ),
              redirect )

  return router
}
