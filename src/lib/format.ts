/** "david o'brien" -> "David O'Brien" */
export function capitalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (m) => m.toUpperCase())
}

const MINOR_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'vs', 'via'])

/** Title Case that never lowercases existing capitals, so codes like RSA or CS 135 survive. */
export function titleCase(text: string): string {
  return text
    .split(' ')
    .map((word, i, words) => {
      const startsClause = i === 0 || words[i - 1].endsWith(':')
      if (!startsClause && MINOR_WORDS.has(word.toLowerCase())) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
