const yaml = require('js-yaml')
const fs = require('fs')

export const convert = (filename: string) => {
  const yamlText = fs.readFileSync(filename)
  const doc = yaml.safeLoad(yamlText, 'utf8')
  return doc
}

if (require.main === module) {
  const json = convert(process.argv[2])
  console.log(JSON.stringify(json))
}

