import { config, } from 'express-locator'
import configs from './configs/config'
import configurators from './configurators'
import controllers from './controllers'
import dependencies from './configs/dependencies'
import { config as dotenv, } from 'dotenv'
import models from './models'
import routes from './routes'
import services from './services'

dotenv()

config(
  configs(), dependencies, models, services, controllers, configurators, routes
)
