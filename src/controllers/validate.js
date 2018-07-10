import { get, } from 'express-locator'

const Instance = get( 'Instance' )

export default class ValidateController extends Instance {
  validate = body => async ( req, res, next ) => {
    req.log && req.log.add( 'request', 'Validate user submitted data' )

    await this.validateService.validateReq( req, { body, } )

    next()
  }
}
