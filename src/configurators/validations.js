export default function validationsConfig ( { get, } ) {
  const joi = get( 'joi' )

  const updateUser = joi
    .object()
    .keys( {
      emails : joi.wowemail().domain(),
      names  : joi.string(),
      photos : joi.url().valid(),
      stores : joi.store().valid(),
    } )
    .required()
  const userUpdate = joi
    .object()
    .keys( {
      email : joi.wowemail().domain(),
      name  : joi.string(),
      photo : joi.url().valid(),
      store : joi.store().valid(),
    } )
    .required()

  return {
    updateUser,
    userUpdate,
  }
}
