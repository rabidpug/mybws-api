export default function articleRoute ( { get, } ) {
  const userInjector = require( '../../lib/userInjector' )

  const { promiseErrorWrap, } = get( 'utilibelt' )
  const { search, } = get( 'articleController' )

  const router = get( 'express' ).Router()

  router.use( get( 'passport' ).authenticate( 'jwt', { session: false, } ) )

  router.use( userInjector )

  router.get( '/:article', promiseErrorWrap( search ) )

  return router
}
