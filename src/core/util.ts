import { DefaultQuery } from "next/router"
import { isArray } from "lodash"

export const getFromQuery = (query: DefaultQuery | undefined, key: string) => {
  if (!query) return ''
  let value = query[key]
  if (isArray(value)) value = value[0]
  value = value || ''
  return value
}