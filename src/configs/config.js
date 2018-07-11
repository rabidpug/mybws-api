import { ExtractJwt, } from 'passport-jwt'

export default function config () {
  return {
    googleStrategy: {
      callbackURL       : process.env.GOOGLE_CALLBACK_URL,
      clientID          : process.env.GOOGLE_CLIENT_ID,
      clientSecret      : process.env.GOOGLE_CLIENT_SECRET,
      passReqToCallback : true,
      scope             : [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read',
      ],
    },
    localStrategy: {
      ignoreExpiration  : true,
      jwtFromRequest    : ExtractJwt.fromAuthHeaderWithScheme( 'jwt' ),
      passReqToCallback : true,
      secretOrKey       : process.env.PASSPORT_SECRET,
    },
    log: {
      console : process.env.LOG_ENABLE_CONSOLE || true,
      file    : process.env.LOG_PATH,
      level   : process.env.LOG_LEVEL || 'info',
      name    : process.env.PROJECT_TITLE,
    },
    mongoose: {
      host : process.env.DB_HOST,
      name : process.env.DB_NAME,
      port : process.env.DB_PORT,
    },
    server: {
      environment : process.env.NODE_ENV,
      logpath     : process.env.LOG_PATH,
      name        : process.env.PROJECT_TITLE,
      path        : process.cwd(),
      port        : process.env.PORT || 8000,
    },
    socket: {
      pingInterval : 3000,
      pingTimeout  : 15000,
    },
    webpush: {
      contactEmail : process.env.GMAIL_USER,
      googleID     : process.env.GOOGLE_CLIENT_ID,
      privateKey   : process.env.VAPID_KEY_PRIVATE,
      publicKey    : process.env.VAPID_KEY_PUBLIC,
    },
  }
}
