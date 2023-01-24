import { exec } from 'child_process'
import { promisify } from 'util'
import { appendExtension } from './append-extension.mjs'
const asyncExec = promisify(exec)

const main = async () => {
  try {
    await asyncExec('npx tsc')
  } catch (error) {
    console.log(`tsc failed, but it's ok.`)
  }
  await appendExtension()
}

main()