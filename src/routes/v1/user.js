export default function userRoute ( { get, } ) {
  const userInjector = require( '../../lib/userInjector' )

  const { update, dopush, fetch, } = get( 'userController' )
  const { promiseErrorWrap, } = get( 'utilibelt' )
  const { validate, } = get( 'validateController' )
  const { updateUser, } = get( 'validations' )
  const router = get( 'express' ).Router()

  router.post( '/refresh', promiseErrorWrap( fetch ) )

  router.use( get( 'passport' ).authenticate( 'jwt', { session: false, } ) )

  router.use( userInjector )

  router.post( '/update', promiseErrorWrap( validate( updateUser ) ), promiseErrorWrap( update ) )

  router.post( '/push', promiseErrorWrap( dopush ) )

  return router
}
