#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const { getConsoleFromSystem } = require('./consoleMapping')
const { normalizeString } = require('./utils')
const SYSTEMS_TO_SCRAPE = [
  'Nintendo - Game Boy',
  'Nintendo - Game Boy Color',
  'Nintendo - Game Boy Advance',
  'Nintendo - Nintendo Entertainment System',
  'Nintendo - Super Nintendo Entertainment System',
  'Nintendo - Nintendo 64',
  'Nintendo - GameCube',
  'Nintendo - Wii',
  'Nintendo - Wii U',
  'Nintendo - Nintendo DS',
  'Nintendo - Nintendo 3DS',
  'Nintendo - Virtual Boy',

  // Sony
  'Sony - PlayStation',
  'Sony - PlayStation 2',
  'Sony - PlayStation 3',
  'Sony - PlayStation Portable',
  'Sony - PlayStation Vita',

  // Sega
  'Sega - Master System',
  'Sega - Mega Drive - Genesis',
  'Sega - Sega CD',
  'Sega - 32X',
  'Sega - Saturn',
  'Sega - Dreamcast',
  'Sega - Game Gear',

  // NEC / PC Engine
  'NEC - PC Engine',
  'NEC - PC Engine CD',
  'NEC - SuperGrafx',

  // SNK
  'SNK - Neo Geo',
  'SNK - Neo Geo Pocket',
  'SNK - Neo Geo Pocket Color',

  // Commodore
  'Commodore - 64',
  'Commodore - Amiga',
  // Others
  'Bandai - WonderSwan',
  'Bandai - WonderSwan Color',
  'GCE - Vectrex',
  'Magnavox - Odyssey2'
]

const OUTPUT_DIR = path.resolve('./output/covers')
const OWNER = 'libretro-thumbnails'
const ROOT_REPO = 'libretro-thumbnails'

/* ============================================================ */

const token = process.env.GITHUB_TOKEN
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'libretro-thumb-scraper',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
}

async function gh(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${txt}`)
  }
  return res.json()
}

/* -------------------- helpers -------------------- */

function rawUrl(owner, repo, commitSha, filePath) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${commitSha}/${filePath}`
}

function stripExt(name) {
  return name.replace(/\.[^.]+$/, '')
}

function normalizeKey(name) {
  let s = name
  s = s.replace(/^update\s+/i, '')
  s = s.replace(/\[[^\]]*]/g, '')
  s = s.replace(/\sv\d+(\.\d+)?/gi, '')
  s = s.replace(/\s+/g, ' ').trim()
  const idx = s.indexOf(' (')
  if (idx !== -1) s = s.slice(0, idx)
  return s.trim()
}

function score(name) {
  let score = 0
  if (/^update/i.test(name)) score += 50
  if (/\[[^\]]*]/.test(name)) score += 20
  if (/(beta|proto|demo)/i.test(name)) score += 20
  if (/\(USA\)/i.test(name)) score -= 3
  if (/\(Europe\)/i.test(name)) score -= 2
  score += (name.match(/\(/g)?.length || 0) * 2
  return score
}

function pickBest(list) {
  return list
    .slice()
    .sort((a, b) => {
      const sa = score(a.name)
      const sb = score(b.name)
      if (sa !== sb) return sa - sb
      return a.name.length - b.name.length
    })[0]
}

/* -------------------- core logic -------------------- */

async function scrapeSystem(systemName) {
  console.log(`\n🔍 Scraping ${systemName}...`)

  const consoleEnum = getConsoleFromSystem(systemName)
  const systemRepo = systemName.replace(/ /g, '_')

  const rootTree = await gh(
    `https://api.github.com/repos/${OWNER}/${ROOT_REPO}/git/trees/master`
  )

  const submodule = rootTree.tree.find(
    (n) => n.type === 'commit' && n.path === systemName
  )

  if (!submodule) {
    console.warn(`System not found: ${systemName}`)
    return
  }

  const commitSha = submodule.sha
  const systemTree = await gh(
    `https://api.github.com/repos/${OWNER}/${systemRepo}/git/trees/${commitSha}?recursive=1`
  )

  const buckets = { box: [], snap: [], logo: [], titles:[] }

  for (const node of systemTree.tree) {
    if (node.type !== 'blob' || !node.path.endsWith('.png')) continue

    const [folder, filename] = node.path.split('/')
    if (!filename) continue

    const name = stripExt(filename)
    const key = normalizeKey(name)

    if (folder === 'Named_Boxarts')
      buckets.box.push({ key, name, path: node.path, size: node.size })

    if (folder === 'Named_Snaps')
      buckets.snap.push({ key, name, path: node.path, size: node.size })

    if (folder === 'Named_Logos')
      buckets.logo.push({ key, name, path: node.path, size: node.size })
     if (folder === 'Named_Titles')
      buckets.titles.push({ key, name, path: node.path, size: node.size })
  }

  const keys = new Set([
    ...buckets.box.map((x) => x.key),
    ...buckets.snap.map((x) => x.key),
    ...buckets.logo.map((x) => x.key),
    ...buckets.titles.map((x) => x.key)
  ])

  const output = []

  for (const key of keys) {
    const box = pickBest(buckets.box.filter((x) => x.key === key))
    const logo = pickBest(buckets.logo.filter((x) => x.key === key))
    const snaps = buckets.snap.filter((x) => x.key === key)
    const titleImage = pickBest(buckets.titles.filter((x) => x.key === key))

    output.push({
      titleNormalized: normalizeString(key),
      title: key,
      size: String(box?.size || logo?.size || snaps[0]?.size || 0),
      logo: logo ? rawUrl(OWNER, systemRepo, commitSha, logo.path) : '',
      title_image: titleImage ? rawUrl(OWNER, systemRepo, commitSha, titleImage.path) : '',
      portrait: box ? rawUrl(OWNER, systemRepo, commitSha, box.path) : '',
      gameplay_covers: snaps.map((s) =>
        rawUrl(OWNER, systemRepo, commitSha, s.path)
      ),
      console: consoleEnum
    })
  }

  output.sort((a, b) => a.title.localeCompare(b.title))

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const outFile = path.join(OUTPUT_DIR, `${consoleEnum}.json`)
  fs.writeFileSync(outFile, JSON.stringify(output, null, 2))

  console.log(`✔ ${output.length} games → ${outFile}`)
}


async function main() {
  for (const system of SYSTEMS_TO_SCRAPE) {
    try {
      await scrapeSystem(system)
    } catch (err) {
      console.error(`Error on ${system}:`, err.message)
    }
  }

  console.log('\nScraping finished')
}

main()
