import { TokensList, Token, Tokens } from "marked"
import { find } from "lodash"
import { IMarkdownDocInfo } from "../../@types/global";

const emptyLink = { href: "", title: "" }

type TGetDocInfo = (tokenArr: TokensList) => IMarkdownDocInfo

export const getDocInfo: TGetDocInfo = (tokenArr) => {
  const firstHeading = find(tokenArr, (t: Token): t is Tokens.Heading => t.type === 'heading' && t.depth === 1)
  const title = firstHeading ? firstHeading.text : ''

  let createTime = (tokenArr.links.createtime || emptyLink).href
  createTime = createTime ? createTime.replace(/-/g,' ') : createTime

  let updateTime = (tokenArr.links.updatetime || emptyLink).href
  updateTime = updateTime ? updateTime.replace(/-/g,' ') : updateTime

  return {
    // links 에 걸린 키는 다 소문자로 변환됨
    title,
    thumbnailUrl: (tokenArr.links.thumbnailurl || emptyLink).href,
    tagArr: (tokenArr.links.tags || emptyLink).href.split(','),
    prev: (tokenArr.links.prev || emptyLink).href,
    next: (tokenArr.links.next || emptyLink).href,
    author: (tokenArr.links.author || emptyLink).href,
    createTime,
    updateTime,
    isDraft: (tokenArr.links.draft || emptyLink).href === 'true',
    duration: (tokenArr.links.duration || emptyLink).href,
  }
}
