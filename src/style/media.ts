const delimiter = [544, 832, 1120, 1632]
const media = {
  xs: `(max-width: ${delimiter[0]}px)`,
  s:  `(min-width: ${delimiter[0]}px)`,
  m:  `(min-width: ${delimiter[1]}px)`,
  l:  `(min-width: ${delimiter[2]}px)`,
  xl: `(min-width: ${delimiter[3]}px)`,
};

export default media
