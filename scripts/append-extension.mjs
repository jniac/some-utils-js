import fs from 'fs/promises'
import path from 'path'

/**
 * @typedef {object} Options
 * @property {RegExp} filter
 * 
 * @param {string} dir 
 * @param {Options} options
 * 
 */
async function* walk(dir, options) {
  const { filter } = options
  for (const entry of await fs.readdir(dir)) {
    const p = path.join(dir, entry)
    const s = await fs.stat(p)
    if (s.isDirectory()) {
      yield* walk(p, options)
    } else {
      if (filter) {
        if (filter.test(p)) {
          yield p
        }
      }
    }
  }
}

export const appendExtension = async () => {
  for await (const entry of walk('js', { filter: /.js$/ })) {
    const data = await fs.readFile(entry, { encoding: 'utf-8' })
    // https://stackoverflow.com/questions/62619058/appending-js-extension-on-relative-import-statements-during-typescript-compilat
    const fromRE = /(from\s+["']\.?\.\/.*)(["'])/g
    if (fromRE.test(data)) {
      const transformedData = data.replace(fromRE, '$1.js$2')
      await fs.writeFile(entry, transformedData, { encoding: 'utf-8' })
      console.log(`append extension to ${entry}`)
    }
  }
}

const isMainModule = import.meta.url.endsWith(process.argv[1])
if (isMainModule) {
  appendExtension()
}
