import * as bounds from 'binary-search-bounds'

const delimiter = [544, 832, 1120, 1632]
const sizeArr = ['xs','s','m','l','xl']
const media = {
  xs: `(max-width: ${delimiter[0]}px)`,
  s:  `(min-width: ${delimiter[0]}px)`,
  m:  `(min-width: ${delimiter[1]}px)`,
  l:  `(min-width: ${delimiter[2]}px)`,
  xl: `(min-width: ${delimiter[3]}px)`,
};

export const getSize = (width: number) => {
  const idx = bounds.ge(delimiter, width)
  return sizeArr[idx]
}
export default media
