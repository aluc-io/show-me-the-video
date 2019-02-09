import * as tracer from 'tracer'

import * as yamlToJson from '../../bin/yaml-to-json'
import { isEmpty } from 'lodash'
import { IApplicationConfig } from 'global';
import { CONST_DOC_DIRECTORY } from '../constant';

const logger = tracer.console()

let config:IApplicationConfig | undefined

if (process.env.APPLICATION_CONFIG) {
  config = JSON.parse(process.env.APPLICATION_CONFIG)
}

if (!config || isEmpty(config)) {
  try {
    config = yamlToJson('application.yml')
  } catch(e) {
    config = yamlToJson('application.yaml')
  }
}

if (!config || isEmpty(config)) {
  logger.error('No config')
  throw new Error('No config')
}

config.backendRepos = config.backendRepos.map( br => {
  return { 
    ...br,
    docDirectory: br.docDirectory || CONST_DOC_DIRECTORY,
  }
})

const exportedConfig: IApplicationConfig = config

export default exportedConfig
