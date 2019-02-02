export const layout = (showLayout: boolean, name: string, color: string) => {
  let css = ''
  if (!showLayout) {
    return css
  }

  if (name) css += `
    ::before {
      content: "${name}";
      position: absolute;
    };
  `

  if (color) css += `background-color: ${color};`

  return css
}
