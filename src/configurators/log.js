export default function logConfig ( expressLocator, config ) {
  const { prettyObject, getPath, } = require( 'utilibelt' )
  const { createLogger, format, transports, } = require( 'winston' )
  const { colorize, combine, timestamp, label, prettyPrint, printf, } = format
  const url = require( 'url' )
  const useragent = require( 'useragent' )
  const chalk = require( 'chalk' )
  const httpstatus = require( 'http-status' )

  function createTransports ( config ) {
    const customTransports = []

    if ( config.file ) {
      customTransports.push( new transports.File( {
        filename : config.file,
        json     : false,
        level    : config.level,
      } ) )
    }

    if ( config.console ) customTransports.push( new transports.Console( { level: config.level, } ) )

    return customTransports
  }

  const log = createLogger( {
    format: combine(
      label( { label: config.name, } ),
      colorize(),
      timestamp(),
      prettyPrint(),
      printf( info => {
        const { timestamp, level, message, label, ...args } = info

        const ts = timestamp.slice( 0, 19 ).replace( 'T', ' ' )

        return `${ts} {${chalk.magenta( label )}}[${level}]: ${message} ${
          Object.keys( args ).length ? JSON.stringify( args, null, 2 ) : ''
        }`
      } )
    ),
    transports: createTransports( config ),
  } )

  log.stream = {
    write ( message ) {
      if ( typeof message === 'object' ) log.info( prettyObject( message ) )
      else {
        const [
          method,
          status,
          error,
          response,
          path,
          user,
          body,
          logs,
          userAgent,
        ] = message.split( /#\$%/ )

        const userData = user && user !== '-' && JSON.parse( user )

        const pathObject = url.parse( path, true )
        const agent = useragent.parse( userAgent )
        const fullstatus = httpstatus[status]
        const userstring =
          user && user !== '-'
            ? `
        ${chalk.bold( '  user:' )} ${
  userData.names ? getPath( userData.names.filter( name => name.selected ), '0.value', 'Unknown' ) : 'Unknown'
} >> ${
  userData.emails
    ? getPath( userData.emails.filter( email => email.selected ), '0.value', 'Unknown' )
    : 'Unknown'
} >> ${
  userData.stores
    ? getPath( userData.stores.filter( store => store.selected ),

               '0.value._id',

               'Unknown' )
    : 'Unknown'
}`
            : ''

        const query =
          typeof pathObject.query === 'object' && Object.keys( pathObject.query ).length > 0
            ? `
        ${chalk.bold( ' query:' )} ${prettyObject( pathObject.query, 8 )}`
            : ''
        const bodystring =
          body === '-' || body === '{}'
            ? ''
            : body
              ? `
        ${chalk.bold( '  body:' )} ${prettyObject( body, 8 )}`
              : ''
        const logstring =
          logs === '-' || logs === '{}'
            ? ''
            : logs
              ? `
        ${chalk.bold( '   log:' )} ${prettyObject( logs, 8 )}`
              : ''

        log.info( `
        ${chalk.bold( 'method:' )} ${
  response < 800
    ? chalk.green( `${response}ms` )
    : response < 1400
      ? chalk.yellow( `${response}ms` )
      : chalk.red( `${response}ms` )
} ${method} >> ${pathObject.pathname}
        ${chalk.bold( 'status:' )} ${
  status < 400 ? chalk.green( status ) : status >= 400 && status < 500 ? chalk.yellow( status ) : chalk.red( status )
} ${fullstatus}${error === '-' ? '' : error ? ` >> ${error}` : ''}
        ${chalk.bold( ' agent:' )} ${agent.toAgent()} | ${agent.os.toString()}${
  agent.device.toString().includes( 'Other' ) ? '' : ` | ${agent.device.toString()}`
}${userstring}${logstring}${query}${bodystring}` )
      }
    },
  }

  return log
}
