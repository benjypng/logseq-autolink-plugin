import { MASK_RE, MAX_NGRAM } from '../constants'

export const candidateNgrams = (content: string): string[] => {
  const words =
    content.replace(MASK_RE, ' ').match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu) ?? []
  const set = new Set<string>()
  for (let i = 0; i < words.length; i++)
    for (let n = 1; n <= MAX_NGRAM && i + n <= words.length; n++)
      set.add(
        words
          .slice(i, i + n)
          .join(' ')
          .toLowerCase(),
      )
  return [...set]
}
