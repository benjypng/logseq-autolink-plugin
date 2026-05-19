export const findExistingTitles = async (
  candidates: string[],
): Promise<string[]> => {
  if (candidates.length === 0) return []
  const q = `
    [:find ?name
     :in $ [?name ...]
     :where
     [?p :block/name ?name]
     (not [?p :db/ident _])]`
  const rows = ((await logseq.DB.datascriptQuery(q, candidates)) ?? []) as [
    string,
  ][]
  return rows.map(([t]) => t)
}
