export default function rangeRoute ( { get, } ) {
  const userInjector = require( '../../lib/userInjector' )

  const { promiseErrorWrap, } = get( 'utilibelt' )
  const { search, } = get( 'rangeController' )

  const router = get( 'express' ).Router()

  router.use( get( 'passport' ).authenticate( 'jwt', { session: false, } ) )

  router.use( userInjector )

  router.get( '/:store', promiseErrorWrap( search ) )

  return router
}
