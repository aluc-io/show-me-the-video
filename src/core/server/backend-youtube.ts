import { google } from 'googleapis'
import { IYoutubeDocInfo } from "../../@types/global";

import config from './config'
import memoizee from 'memoizee'

const youtube = google.youtube({
  version: 'v3',
  auth: config.youtubeAPIKey,
})

const part = ['snippet','contentDetails','statistics','status'].join(',')

type TGetEmptyDocInfo = () => IYoutubeDocInfo
type TGetDocInfo = (id: string) => Promise<IYoutubeDocInfo>
const _getDocInfo: TGetDocInfo = async (id) => {
  console.log(`${__filename} getDocInfo(${id})`)
  const videoRes = await youtube.videos.list({ id, part })
  if (!videoRes.data.items) throw new Error('SMTV_ERROR_129312_NO_YOUTUBE_ITEM')

  const videoItem = videoRes.data.items[0]
  if (!videoItem) throw new Error('SMTV_ERROR_4129')
  if (!videoItem.snippet) throw new Error('SMTV_ERROR_4123')
  if (!videoItem.snippet.thumbnails) throw new Error('SMTV_ERROR_4127')
  if (!videoItem.contentDetails) throw new Error('SMTV_ERROR_4124_NO_CONTENT_DETAILS_IN_VIDEO_RES')

  const { snippet, contentDetails } = videoItem
  const { thumbnails } = videoItem.snippet
  const channelId = snippet.channelId
  const channelRes = await youtube.channels.list({ id: channelId, part: 'snippet' })
  if (!channelRes.data.items) throw new Error('SMTV_ERROR_4125')

  const channelItem = channelRes.data.items[0]
  if (!channelItem.snippet) throw new Error('SMTV_ERROR_4126')

  // PT7M45S -> 7:45
  let duration = contentDetails.duration || ''
  duration = duration.replace(/^PT/,'').replace(/S$/g,'').replace(/[HM]/g,':')

  const thumbnailUrl = thumbnails.high
    ? thumbnails.high.url : thumbnails.default
    ? thumbnails.default.url : ''

  const emptyInfo = getEmptyDocInfo()
  return {
    author: channelItem.snippet.title || emptyInfo.title,
    createTime: snippet.publishedAt || emptyInfo.createTime,
    duration: duration,
    tagArr: snippet.tags || emptyInfo.tagArr,
    thumbnailUrl: thumbnailUrl || emptyInfo.thumbnailUrl,
    title: snippet.title || emptyInfo.title,
  }
}

export const getDocInfo = memoizee(_getDocInfo, { maxAge: 5 * 60 * 1000 })

export const getEmptyDocInfo: TGetEmptyDocInfo = () => {
  return {
    author: '',
    createTime: '',
    duration: '',
    tagArr: [],
    thumbnailUrl: '',
    title: '',
  }
}

/*
export const parseVideoInfo: (filename: string, text: string) => IDocInfo = (filename, text) => {
  const { youtubeAPIKey } = config
  const youtubeId = 'kdkd'

  const queryString = qs.stringify({
    key: youtubeAPIKey,
    id: youtubeId,
    part: ['snippet','contentDetails','statistics','status'].join(','),
  })

  const [err,res] = await to( request.get(`/videos?${queryString}`))

}

*/
