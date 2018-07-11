export default function authRoute ( { get, } ) {
  const { redirect, refresh, } = get( 'userController' )
  const { promiseErrorWrap, } = get( 'utilibelt' )

  const router = get( 'express' ).Router()

  router.get( '/', ( req, res, next ) => {
    const { query: { redirect, }, } = req

    get( 'passport' ).authenticate( 'google', {
      scope: [
        'profile',
        'email',
      ],
      session : false,
      state   : redirect,
    } )( req, res, next )
  } )

  router.get( '/callback', get( 'passport' ).authenticate( 'google', { session: false, } ), redirect )

  router.post( '/', get( 'passport' ).authenticate( 'jwt', { session: false, } ), promiseErrorWrap( refresh ) )

  return router
}
