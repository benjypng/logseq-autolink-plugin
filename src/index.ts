import '@logseq/libs'

import { autolinkContent, candidateNgrams, findExistingTitles } from './libs'
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin'

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

  // Check if plugin is being used on the DB version
  const isDbGraph = await logseq.App.checkCurrentIsDbGraph()
  if (!isDbGraph) {
    logseq.UI.showMsg(
      'logseq-autolink-plugin: Can only be used in a DB graph',
      'error',
    )
    return
  }

  logseq.DB.onChanged(async ({ blocks, txMeta }) => {
    if (!txMeta || !txMeta.outlinerOp || !blocks[0]) return

    switch (txMeta.outlinerOp) {
      case 'save-block': {
        break
      }

      case 'insert-blocks': {
        const currBlkUuid = await logseq.Editor.checkEditing()
        if (!currBlkUuid) return

        const prevSiblingBlk = await logseq.Editor.getPreviousSiblingBlock(
          currBlkUuid as string,
        )
        if (!prevSiblingBlk) return

        const content = (prevSiblingBlk as { content?: string }).content
        if (!content) return

        const titles = await findExistingTitles(candidateNgrams(content))
        if (titles.length === 0) return

        const out = autolinkContent(content, titles)
        if (out !== content)
          await logseq.Editor.updateBlock(
            (prevSiblingBlk as { uuid: string }).uuid,
            out,
          )
        break
      }
    }
  })
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
