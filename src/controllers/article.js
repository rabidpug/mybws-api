import { get, } from 'express-locator'

const Instance = get( 'Instance' )

export default class ArticleController extends Instance {
  search = async _id => {
    const rawart = await this.Article.findById( _id )

    if ( rawart ) {
      const blocks = await this.Block.find()
      const article = rawart.toJSON()

      const [ relevantBlock, ] = blocks.filter( block => block.articles.includes( article._id ) )

      if ( relevantBlock ) {
        article.blockmsg = relevantBlock.message

        article.allowpath = relevantBlock.allowpath

        article.allowvalues = relevantBlock.allowvalues
      }
      return article
    } else throw new Error( 'The provided article number does not exist' )
  }
}
