export default function resolvers ( { get, } ) {
  const { gql, PubSub, UserInputError, withFilter, } = get( 'gql' )

  const pubsub = new PubSub()
  const USER_MODIFIED = 'USER_MODIFIED'

  return {
    resolvers: {
      Mutation: {
        async updateUser ( _, args, { user, } ) {
          try {
            await get( 'validateService' ).updateUserValidation( args, UserInputError )
          } catch ( e ) {
            throw new UserInputError( e.message, { invalidArgs: Object.keys( args ), } )
          }
          if ( !user ) user = await get( 'User' ).findOne( {} )

          for ( const [
            key,
            value,
          ] of Object.entries( args ) ) {
            if ( value && `${key}s` in user ) {
              if ( user[`${key}s`].length === 1 && user[`${key}s`][0].value === value ) throw new UserInputError( `Cannot delete the last ${key}` )

              user[key] = value
            }
          }

          pubsub.publish( USER_MODIFIED, { userModified: user, } )

          return user.save()
        },
      },
      Query: {
        getArticle    : async ( _, { id, } ) => get( 'articleController' ).search( id ),
        getPlanograms : async ( _id, args ) => get( 'pogController' ).search( args ),
        getRange      : async ( _, args ) => get( 'rangeController' ).search( args ),
        getStore      : async ( _, { id, } ) => get( 'Store' ).findById( id ),
        getStores     : async ( _, { ids, } ) => get( 'Store' ).find( ids ? { _id: { $in: ids, }, } : {} ),
        getUser       : async ( _, { id, }, { user, } ) => get( 'User' ).findById( id ? id : user && user._id ),
        getUsers      : async ( _, { ids, } ) => get( 'User' ).find( ids ? { _id: { $in: ids, }, } : {} ),
      },
      Subscription: {
        userModified: {
          subscribe: withFilter( () => pubsub.asyncIterator( [ USER_MODIFIED, ] ),
                                 ( payload, variables ) => payload.userModified.googleid === variables.googleid ),
        },
      },
    },
    typeDefs: gql`
      type Subscription {
        userModified(googleid: String): User
      }
      type Mutation {
        updateUser(name: String, email: String, photo: String, role: String, store: Int): User
      }
      type Query {
        getUsers(ids: [String]): [User]
        getUser(id: String): User
        getStores(ids: [Int]): [Store]
        getStore(id: Int): Store
        getArticles(ids: [Int]): [Article]
        getArticle(id: Int): Article
        getPlanogram(id: String): Planogram
        getPlanograms(ids: [String], store: Int, article: Int): [Planogram]
        getRange(
          store: Int
          groupFilters: [String]
          statusFilters: [String]
          descendingSort: Boolean
          sort: [String]
          exactSearch: Boolean
          search: String
        ): [Int]
      }
    `,
  }
}
