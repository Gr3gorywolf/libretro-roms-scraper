#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
console.log(process.env.GITHUB_TOKEN);
const { getConsoleFromSystem, CONSOLES } = require('../../constants/console-mapping')
const { normalizeString } = require('../../utils/utils')
const SYSTEMS_TO_SCRAPE = {
  [CONSOLES.NINTENDO_GAME_BOY]:'Nintendo - Game Boy',
  [CONSOLES.NINTENDO_GAME_BOY_COLOR]:'Nintendo - Game Boy Color',
  [CONSOLES.NINTENDO_GAME_BOY_ADVANCE]:'Nintendo - Game Boy Advance',
  [CONSOLES.NINTENDO_NES]:'Nintendo - Nintendo Entertainment System',
  [CONSOLES.NINTENDO_SNES]:'Nintendo - Super Nintendo Entertainment System',
  [CONSOLES.NINTENDO_64]:'Nintendo - Nintendo 64',
  [CONSOLES.NINTENDO_GAMECUBE]:'Nintendo - GameCube',
  [CONSOLES.NINTENDO_WII]:'Nintendo - Wii',
  [CONSOLES.NINTENDO_WII_U]:'Nintendo - Wii U',
  [CONSOLES.NINTENDO_DS]:'Nintendo - Nintendo DS',
  [CONSOLES.NINTENDO_3DS]:'Nintendo - Nintendo 3DS',
  [CONSOLES.NINTENDO_VIRTUAL_BOY]:'Nintendo - Virtual Boy',

  // Sony
  [CONSOLES.SONY_PLAYSTATION]:'Sony - PlayStation',
  [CONSOLES.SONY_PLAYSTATION_2]:'Sony - PlayStation 2',
  [CONSOLES.SONY_PLAYSTATION_3]:'Sony - PlayStation 3',
  [CONSOLES.SONY_PSP]:'Sony - PlayStation Portable',
  [CONSOLES.SONY_PLAYSTATION_VITA]:'Sony - PlayStation Vita',

  // Sega
  [CONSOLES.SEGA_MASTER_SYSTEM]:'Sega - Master System',
  [CONSOLES.SEGA_GENESIS]:'Sega - Mega Drive - Genesis',
  [CONSOLES.SEGA_CD]:'Sega - Sega CD',
  [CONSOLES.SEGA_32X]:'Sega - 32X',
  [CONSOLES.SEGA_SATURN]:'Sega - Saturn',
  [CONSOLES.SEGA_DREAMCAST]:'Sega - Dreamcast',
  [CONSOLES.SEGA_GAME_GEAR]:'Sega - Game Gear',
  // NEC / PC Engine
  [CONSOLES.NEC_PC_ENGINE]:'NEC - PC Engine',
  [CONSOLES.NEC_PC_ENGINE_CD]:'NEC - PC Engine CD',
  [CONSOLES.NEC_SUPERGRAFX]:'NEC - SuperGrafx',

  // SNK
  [CONSOLES.SNK_NEO_GEO]:'SNK - Neo Geo',
  [CONSOLES.SNK_NEO_GEO_POCKET]:'SNK - Neo Geo Pocket',
  [CONSOLES.SNK_NEO_GEO_POCKET_COLOR]:'SNK - Neo Geo Pocket Color',

  // Commodore
  [CONSOLES.COMMODORE_64]:'Commodore - 64',
  [CONSOLES.COMMODORE_AMIGA]:'Commodore - Amiga',
  // Others
  [CONSOLES.BANDAI_WONDERSWAN]:'Bandai - WonderSwan',
  [CONSOLES.BANDAI_WONDERSWAN_COLOR]:'Bandai - WonderSwan Color',
  [CONSOLES.GCE_VECTREX]:'GCE - Vectrex',
  [CONSOLES.MAGNAVOX_ODYSSEY_2]:'Magnavox - Odyssey2'
}

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

async function Scrape(consoleSlug) {
  const systemName = SYSTEMS_TO_SCRAPE[consoleSlug]
  if (!systemName) {
    console.warn(`Console slug not mapped: ${consoleSlug}`)
    return
  }
  console.log(`libretro-covers:\n🔍 Scraping ${systemName}...`)

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

 
  console.log(`libretro-covers: ✔ ${output.length} games`)
  return output;
}


module.exports = {
  Scrape
}


