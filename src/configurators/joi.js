export default function joiConfig () {
  const Joi = require( 'joi' )

  return Joi.extend( [
    joi => ( {
      base     : joi.string(),
      language : { valid: 'needs to be a URL', },
      name     : 'url',
      rules    : [
        {
          name: 'valid',
          validate (
            params, value, state, options
          ) {
            const isUrl = require( 'utilibelt' ).urlRegex.test( value )

            return isUrl ? value : this.createError(
              'url.valid', { v: value, }, state, options
            )
          },
        },
      ],
    } ),
    joi => ( {
      base     : joi.number(),
      language : { valid: 'needs to be a valid store number', },
      name     : 'store',
      rules    : [
        {
          name: 'valid',
          validate (
            params, value, state, options
          ) {
            const isValid = value > 1000 && value < 8000

            return isValid ? value : this.createError(
              'store.valid', { v: value, }, state, options
            )
          },
        },
      ],
    } ),
    joi => ( {
      base     : joi.string().email(),
      language : { domain: 'needs to be a Woolworths LTD email', },
      name     : 'wowemail',
      rules    : [
        {
          name: 'domain',
          validate (
            params, value, state, options
          ) {
            const isWowDomain = new RegExp( '((?:bws|edg|woolworths|danmurphys).com.au|(?:jcuneo).com)$', 'i' ).test( value )

            return isWowDomain ? value : this.createError(
              'wowemail.domain', { v: value, }, state, options
            )
          },
        },
      ],
    } ),
  ] )
}
