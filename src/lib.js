// Split into user-perceived characters so Thai vowels/tone marks stay attached.
export function graphemes(line) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(line), (s) => s.segment)
  }
  return Array.from(line)
}

// Largest font size (px, on the 1920x1080 stage) that fits the text, then user scale on top.
export function fontSizeFor(lines, sizePercent) {
  const n = Math.max(1, lines.length)
  const maxLen = Math.max(1, ...lines.map((l) => graphemes(l).length))
  const byWidth = (1640 / maxLen - 8) / 0.65
  const byHeight = 860 / (n * 1.05 + (n - 1) * 0.12)
  const fit = Math.min(220, byWidth, byHeight)
  return Math.max(24, fit * (sizePercent / 100))
}
