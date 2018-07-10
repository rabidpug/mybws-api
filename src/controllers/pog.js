import { get, } from 'express-locator'

const Instance = get( 'Instance' )

export default class PogController extends Instance {
  search = async ( { ids, store, article, } ) => {
    let search = {}

    if ( ids ) search._id = { $in: ids, }
    if ( store ) search.stores = store
    if ( article ) {
      search = {
        ...search,
        ...{ 'articles.onshow.article': article, },
      }
    }
    return this.Planogram.find( search )
  }
}
