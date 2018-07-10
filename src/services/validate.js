import { get, } from 'express-locator'

const Instance = get( 'Instance' )

export default class ValidateService extends Instance {
  async validateReq ( req, validation ) {
    const options = {
      abortEarly   : false,
      allowUnknown : true,
    }

    if ( !validation ) return
    const validProperties = [
      'body',
      'query',
      'params',
    ]

    for ( const i in validation ) {
      if ( validProperties.indexOf( i ) < 0 ) throw new this.ControlledError( `An unsupported validation key (${i}) was set in route` )
      else {
        if ( typeof req[i] === 'undefined' ) throw new this.ControlledError( `Missing request ${i}` )

        const result = this.joi.validate( req[i], validation[i], options )

        if ( result.error ) throw new this.ControlledError( result.error.details[0].message )
        else if ( req[i].stores ) {
          const Store = this.mongoose.model( 'Store' )
          const exists = await Store.findById( req[i].stores )

          if ( !exists ) throw new this.ControlledError( '"stores" needs to be a valid store number' )
        }
      }
    }

    req.log && req.log.add( 'info', 'Passed validation' )

    return true
  }

  async updateUserValidation ( args, ErrorObj ) {
    const options = {
      abortEarly   : false,
      allowUnknown : true,
    }
    const result = this.joi.validate( args, this.validations.userUpdate, options )

    if ( result.error ) throw new ErrorObj( result.error.details[0].message )
    else if ( args.store ) {
      const store = await this.Store.findById( args.store )

      if ( !store ) throw new ErrorObj( '"stores" needs to be a valid store number' )
    }
  }
}
