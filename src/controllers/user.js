import { get, } from 'express-locator'

const Instance = get( 'Instance' )

export default class UserController extends Instance {
  sign = async ( req, accessToken, refreshToken, profile, done ) => {
    const { query: { state, }, } = req

    req.log.add( 'request', 'Google authentication' )

    try {
      const user = this.userService.constructUser( profile, req )

      const { _id, } = user
      const result = await this.userService.signUser( { _id, }, user, req )

      result.state = state

      done( null, result )
    } catch ( err ) {
      err.state = state

      done( null, null, err )
    }
  }

  resign = async ( req, jwtPayload, done ) => {
    req.log.add( 'request', 'JWT validation' )

    const expirationDate = new Date( jwtPayload.exp * 1000 )
    const { headers: { refreshtoken: refreshToken, }, } = req

    const { _id, } = jwtPayload

    const search = expirationDate < new Date() ? { refreshToken, } : { _id, }

    search.refreshToken && req.log.add( 'warn', `Token expired, using refresh token` )

    const result = await this.userService.signUser( search, null, req )

    done( null, result )
  }

  redirect = ( req, res ) => {
    const { user, } = req
    const { token, refreshToken, state, } = user

    req.log.add( 'info', 'redirecting client with token' )

    res.redirect( require( 'url' ).format( {
      pathname : state,
      query    : {
        refreshToken,
        token,
      },
    } ) )
  }

  dopush = async ( req, res, next ) => {
    req.log.add( 'request', 'Push notification subscription' )

    const {
      body: { subscription, deviceName, },
      user,
    } = req

    let noDeviceMatch = false
    const newArray = user.pushSubscriptions.filter( sub => {
      const isMatch = JSON.stringify( sub.key ) === JSON.stringify( subscription )

      if ( isMatch && sub.deviceName !== deviceName ) noDeviceMatch = sub.deviceName
      return !isMatch
    } )
    const isAdding = newArray.length === user.pushSubscriptions.length

    if ( noDeviceMatch ) next( new this.ControlledError( `Push notifications already registered for device under the name ${noDeviceMatch}` ) )
    else {
      if ( isAdding ) {
        user.pushSubscriptions = [
          ...user.pushSubscriptions,
          {
            deviceName,
            key: subscription,
          },
        ]
      } else user.pushSubscriptions = newArray

      await user.save( req )

      if ( user.pushSubscriptions.length > 0 ) {
        const data = {
          body  : `Push notifications have been ${isAdding ? 'activated' : 'deactivated'} for the device ${deviceName}`,
          scope : 'myProfile',
          title : 'Push notification subscriptions change',
        }

        user.pushSubscriptions.forEach( sub => this.webpush.sendNotification( sub.key, JSON.stringify( data ) ) )
      }

      req.log.add( 'info', `Subscription ${isAdding ? 'saved to' : 'removed from'} profile` )

      res.json( { status: 'ok', } )
    }
  }

  refresh = async ( req, res ) => {
    req.log.add( 'request', 'refresh token' )

    const { headers: { refreshtoken: refreshToken, }, } = req
    const user = await this.userService.signUser( { refreshToken, }, null, req )

    res.json( {
      user: {
        ...user,
        token: user.token,
      },
    } )
  }

  update = async ( req, res ) => {
    req.log.add( 'request', 'Update profile' )

    const { user, body, } = req
    const [ key, ] = Object.keys( body )
    const value = body[key]
    const isDeletingValue = user[key].some( item => ( item.value === value || item.value._id === value ) && item.selected )
    const isNewItem = user[key].every( item => !( item.value === value || item.value._id === value ) )

    if ( isDeletingValue && user[key].length === 1 && key !== 'stores' ) throw new this.ControlledError( `Deletion not possible - cannot delete last value` )
    else {
      const type = isDeletingValue ? 'delete' : isNewItem ? 'add' : 'modify'
      const body = {
        key,
        type,
        user,
        value,
      }

      await this.userService.updateProfile( body, req )

      res.json( { status: 'ok', } )
    }
  }
}
