import { MASK_RE } from '../constants'

export const autolinkContent = (content: string, titles: string[]): string => {
  const sorted = titles
    .filter((t) => t.length >= 2)
    .sort((a, b) => b.length - a.length)
  if (sorted.length === 0) return content

  const masked: [number, number][] = []
  for (const m of content.matchAll(MASK_RE))
    masked.push([m.index!, m.index! + m[0].length])
  const blocked = (s: number, e: number) =>
    masked.some(([ms, me]) => s < me && e > ms)

  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}])(?:${escaped.join('|')})(?![\\p{L}\\p{N}])`,
    'giu',
  )

  const edits: [number, number, string][] = []
  for (const m of content.matchAll(re)) {
    const i = m.index!
    const j = i + m[0].length
    if (blocked(i, j)) continue
    edits.push([i, j, `[[${m[0]}]]`])
  }

  if (edits.length === 0) return content
  edits.sort((a, b) => b[0] - a[0])
  let out = content
  for (const [s, e, rep] of edits) out = out.slice(0, s) + rep + out.slice(e)
  return out
}
