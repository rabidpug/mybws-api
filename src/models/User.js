export default function userModel ( { get, } ) {
  const mongoose = get( 'mongoose' )
  // const { getPath, } = get( 'utilibelt' )
  const { Schema, } = mongoose
  const UserGql = get( 'gql' ).gql`
    scalar Date
    scalar Object

    type Stringlist {
      value: String
      selected: Boolean
    }
    type Intlist {
      value: String
      selected: Boolean
    }
    type PushSubs {
      deviceName: String
      key: Object
    }
    type User {
      emails: [Stringlist]
      email: String
      googleid: String
      isStore: Boolean
      lastOnline: Date
      names: [Stringlist]
      name: String
      photos: [Stringlist]
      photo: String
      pushSubscriptions: [PushSubs]
      roles: [Stringlist]
      role: String
      socketid: [String]
      stores: [Intlist]
      store: Int
    }
  `
  const UserSchema = Schema( {
    _id    : { type: String, },
    emails : {
      index    : true,
      required : true,
      type     : [
        {
          selected : Boolean,
          value    : String,
        },
      ],
    },
    isStore: {
      index    : true,
      required : true,
      type     : Boolean,
    },
    lastOnline: {
      default : Date.Now,
      type    : Date,
    },
    names: {
      index    : true,
      required : true,
      type     : [
        {
          selected : Boolean,
          value    : String,
        },
      ],
    },
    photos: {
      required : false,
      type     : [
        {
          selected : Boolean,
          value    : String,
        },
      ],
    },
    pushSubscriptions: [
      {
        deviceName : String,
        key        : Object,
      },
    ],
    roles: {
      index    : true,
      required : true,
      type     : [
        {
          selected : Boolean,
          value    : {
            default : 'Store Team',
            enum    : [
              'Admin',
              'Area Coach',
              'Category Assistant',
              'Category Manager',
              'Local Category Manager',
              'Space Team',
              'Store Team',
            ],
            type: String,
          },
        },
      ],
    },
    socketid : [ String, ],
    stores   : {
      index    : true,
      required : false,
      type     : [
        {
          selected : Boolean,
          value    : {
            ref  : 'Store',
            type : Number,
          },
        },
      ],
    },
  },
                             {
                               toJSON   : { virtuals: true, },
                               toObject : { virtuals: true, },
                             } )

  function getSelectedValue ( _, { path, } ) {
    const key = `${path}s`

    return this[key].length === 1
      ? this[key][0].value
      : this[key].length > 1
        ? this[key].reduce( ( selectedValue, { selected, value, } ) => selected ? value : selectedValue, null )
        : null
  }

  function setSelectedValue ( value, { path, } ) {
    const key = `${path}s`

    const isSelected = this[key].some( option => option.selected && option.value === value )
    const isNew = this[key].every( option => option.value !== value )

    if ( isSelected ) {
      this[key] = this[key].filter( option => option.value !== value )

      if ( isSelected ) this[key][0].selected = true
    } else {
      isNew &&
        this[key].push( {
          selected: true,
          value,
        } )

      this[key] = this[key].map( option => {
        option.selected = option.value === value

        return option
      } )
    }
  }

  UserSchema.virtual( 'name' )
    .get( getSelectedValue )
    .set( setSelectedValue )

  UserSchema.virtual( 'email' )
    .get( getSelectedValue )
    .set( setSelectedValue )

  UserSchema.virtual( 'photo' )
    .get( getSelectedValue )
    .set( setSelectedValue )

  UserSchema.virtual( 'store' )
    .get( getSelectedValue )
    .set( setSelectedValue )

  UserSchema.virtual( 'role' )
    .get( getSelectedValue )
    .set( setSelectedValue )

  UserSchema.virtual( 'googleid' )
    .get( function getID () {
      return this._id
    } )
    .set( function setID ( v ) {
      this._id = v
    } )

  UserSchema.pre( 'save', function preSave ( next ) {
    this.lastOnline = new Date()

    // const { socketid, } = this
    // const socket = getPath( req, 'server.to' ) ? req.server : req.io

    // if ( socketid && socketid.length && socket ) {
    //   socketid.forEach( session => {
    //     if ( socket.to( session ).sockets[session] ) socket.to( session ).sockets[session].log.add( 'info', 'Profile update sent' )

    //     socket.to( session ).emit( 'PROFILE_UPDATE', this )
    //   } )
    // }

    next()
  } )

  const User = mongoose.model( 'User', UserSchema )

  User.gql = UserGql

  return User
}
