export default function v1Route ( { get, } ) {
  const router = get( 'express' ).Router()

  router.use( '/user', get( 'userRoute' ) )

  router.use( '/google', get( 'googleRoute' ) )

  router.use( '/range', get( 'rangeRoute' ) )

  router.use( '/article', get( 'articleRoute' ) )

  router.use( '/pog', get( 'pogRoute' ) )

  return router
}
