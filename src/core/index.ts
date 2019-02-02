
const isServer: boolean = !! process.env.SMTV_CLONE_REPO_URL

const getVideoInfoArr = () => {
  // './server' 쪽 코드가 client 환경으로 내려가지 않도록
  // webpack.IgnorePlugin 으로 처리해줘야한다
  return isServer
    ? require('./server').getVideoInfoArr()
    : require('./client').getVideoInfoArr()
}

const getGuideInfo = (guideId: string) => {
  // './server' 쪽 코드가 client 환경으로 내려가지 않도록
  // webpack.IgnorePlugin 으로 처리해줘야한다
  return isServer
    ? require('./server').getGuideInfo(guideId)
    : require('./client').getGuideInfo(guideId)
}

export {
  getVideoInfoArr,
  getGuideInfo,
}
