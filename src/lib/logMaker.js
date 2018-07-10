export class Logger {
  constructor () {
    this.logs = {}

    this.head = []
  }

  get () {
    return this.logs
  }

  getAll () {
    this.head[7] = JSON.stringify( this.logs )

    return this.head.join( '#$%' )
  }

  set ( { handshake, user, } ) {
    const indexes = [
      'method',
      'status',
      'error',
      'response',
      'path',
      'user',
      'body',
      'logs',
      'userAgent',
    ]

    if ( handshake ) {
      const {
        headers,
        query: { token, refreshToken, ...query },
      } = handshake

      token

      refreshToken

      const data = {
        body      : query,
        error     : '-',
        method    : 'websocket',
        path      : 'session',
        response  : 0,
        status    : 200,
        useragent : headers['user-agent'],
      }

      Object.keys( data ).forEach( key => {
        this.head[indexes.indexOf( key )] = typeof data[key] === 'object' ? JSON.stringify( data[key] ) : data[key]
      } )
    } else if ( user ) this.head[5] = JSON.stringify( handshake )
  }

  add ( logType, logItem ) {
    const nextItem = Object.keys( this.logs ).length + 1

    this.logs[nextItem] = ` [${this.colorit( logType )}]: ${logItem}`
  }

  colorit ( logType ) {
    switch ( logType ) {
    case 'request':
      return `##magenta%%${logType}%%`
    case 'info':
      return `##green%%${logType}%%`
    case 'debug':
      return `##blue%%${logType}%%`
    case 'warn':
      return `##yellow%%${logType}%%`
    case 'error':
      return `##red%%${logType}%%`
    }
  }
}

export function loggerMiddleware ( req, res, next ) {
  req.log = new Logger()

  next()
}
