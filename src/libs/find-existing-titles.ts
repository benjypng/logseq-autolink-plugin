export const findExistingTitles = async (
  candidates: string[],
): Promise<Map<string, string>> => {
  const map = new Map<string, string>()
  if (candidates.length === 0) return map

  const onlyNonEmpty = logseq.settings?.linkOnlyNonEmptyPages !== false
  const q = `
    [:find ?name ?uuid (count ?ref)
     :in $ [?name ...]
     :where
     [?p :block/name ?name]
     (not [?p :db/ident _])
     (not [?p :logseq.property/deleted-at _])
     [?p :block/uuid ?uuid]
     ${
       onlyNonEmpty
         ? '(or-join [?p ?ref] [?ref :block/page ?p] [?ref :block/refs ?p])'
         : '[(ground 0) ?ref]'
     }]`

  const rows = ((await logseq.DB.datascriptQuery(q, candidates)) ?? []) as [
    string,
    string,
    number,
  ][]

  const counts = new Map<string, number>()
  for (const [name, uuid, count] of rows) {
    if (!map.has(name) || count > (counts.get(name) ?? -1)) {
      map.set(name, uuid)
      counts.set(name, count)
    }
  }
  return map
}
