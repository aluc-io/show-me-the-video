import { parse } from 'url'
import * as path from 'path'
import * as express from 'express'
import * as next from 'next'
import { console } from 'tracer'

import { getRepoInfoArr, getDocInfo } from './core'

const logger = console()

const port = parseInt(process.env.PORT || "3000", 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: 'src' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use('/asset', express.static( path.join(__dirname,'..','asset')))

  server.get('/:repoIdx/:guideId', (req,res) => {
    const repoIdx = req.param('repoIdx')
    const guideId = req.param('guideId')
    const query = { ...parse(req.url, true).query, guideId, repoIdx }
    app.render(req,res,'/guide',query)
  })

  server.get('/api/v1/:repoIdx/:docId', async (req,res) => {
    const repoIdx = req.param('repoIdx')
    const docId = req.param('docId')
    logger.debug(`get api call: /api/v1/${repoIdx}/${docId}`)
    const guideInfo = await getDocInfo(repoIdx, docId)
    res.json(guideInfo)
  })

  server.get('/api/v1/repoInfoArr', async (_,res) => {
    logger.debug('get api call: /api/v1/repoInfoArr')
    const videoInfoArr = await getRepoInfoArr()
    res.json(videoInfoArr)
  })

  server.get('*', (req,res) => {
    const parsedUrl = parse(req.url, true)
    handle(req,res,parsedUrl)
  })
  server.listen( port, (err: any) => {
    if (err) throw err
    logger.debug(`> Ready on http://localhost:${port}`)
  })
})

