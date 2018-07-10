export default function webpushConfig ( expressLocator, { googleID, contactEmail, publicKey, privateKey, } ) {
  const webpush = require( 'web-push' )

  webpush.setGCMAPIKey( googleID )

  webpush.setVapidDetails( `mailto:${contactEmail}`, publicKey, privateKey )

  return webpush
}
