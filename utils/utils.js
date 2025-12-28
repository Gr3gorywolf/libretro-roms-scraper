const normalizeString = (str) => {
  return str.replace(/[^a-zA-Z0-9]/g, '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase();
}


function normalizeDate(raw) {
  if (!raw) return ''

  const cleaned = raw.replace(/\(.*?\)/g, '').trim()
  const date = new Date(cleaned)

  if (isNaN(date.getTime())) return ''

  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()

  return `${dd}-${mm}-${yyyy}`
}

function characterSimilarity(a, b) {
  if (!a || !b) return 0

  const freq = {}
  for (const ch of b) freq[ch] = (freq[ch] || 0) + 1

  let matches = 0
  for (const ch of a) {
    if (freq[ch]) {
      matches++
      freq[ch]--
    }
  }

  return matches / a.length
}


function wordSimilarity(a, b) {
  const aWords = a.split(' ')
  const bWords = new Set(b.split(' '))

  let matches = 0
  for (const word of aWords) {
    if (bWords.has(word)) matches++
  }

  return matches / aWords.length
}


module.exports = {
  normalizeString,
  normalizeDate,
  characterSimilarity,
  wordSimilarity
};


