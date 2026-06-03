import '@logseq/libs'

import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin'

import { autolinkContent, candidateNgrams, findExistingTitles } from './libs'

const settings: SettingSchemaDesc[] = [
  {
    key: 'maxNGrams',
    type: 'number',
    default: 5,
    title: 'Maximum N-grams',
    description:
      'Change this number if your page titles are generally larger than 5 words, and you are not getting a match on these page titles.',
  },
]

const main = async () => {
  logseq.UI.showMsg('logseq-autolink-plugin loaded')

  const isDbGraph = await logseq.App.checkCurrentIsDbGraph()
  if (!isDbGraph) {
    logseq.UI.showMsg(
      'logseq-autolink-plugin: Can only be used in a DB graph',
      'error',
    )
    return
  }

  const autolinkBlock = async (uuid: string, content: string) => {
    const titles = await findExistingTitles(candidateNgrams(content))
    if (titles.length === 0) return
    const out = autolinkContent(content, titles)
    if (out !== content) await logseq.Editor.updateBlock(uuid, out)
  }

  logseq.DB.onChanged(async ({ txMeta }) => {
    if (txMeta?.outlinerOp !== 'insert-blocks') return

    const uuid = await logseq.Editor.checkEditing()
    if (!uuid) return

    const tryLink = async (): Promise<boolean> => {
      const blk = await logseq.Editor.getBlock(uuid as string)
      const content = (blk as { content?: string } | null)?.content
      if (!content) return false
      await autolinkBlock(uuid as string, content)
      return true
    }

    if (!(await tryLink())) setTimeout(tryLink, 1100)
  })
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
