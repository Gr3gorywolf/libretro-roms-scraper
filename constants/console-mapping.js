/**
 * Maps libretro-thumbnails system folder names
 * to your internal console enum
 */


const CONSOLES = {
  // Nintendo
  NINTENDO_GAME_BOY: 'gb',
  NINTENDO_GAME_BOY_COLOR: 'gbc',
  NINTENDO_GAME_BOY_ADVANCE: 'gba',
  NINTENDO_NES: 'nes',
  NINTENDO_SNES: 'snes',
  NINTENDO_64: 'n64',
  NINTENDO_GAMECUBE: 'gc',
  NINTENDO_WII: 'wii',
  NINTENDO_WII_U: 'wiiu',
  NINTENDO_DS: 'nds',
  NINTENDO_3DS: '3ds',
  NINTENDO_VIRTUAL_BOY: 'vb',
  NINTENDO_SWITCH: 'switch',

  // Sony
  SONY_PLAYSTATION: 'ps1',
  SONY_PLAYSTATION_2: 'ps2',
  SONY_PLAYSTATION_3: 'ps3',
  SONY_PSP: 'psp',
  SONY_PLAYSTATION_VITA: 'psvita',

  // Sega
  SEGA_MASTER_SYSTEM: 'sms',
  SEGA_GENESIS: 'genesis',
  SEGA_CD: 'segacd',
  SEGA_32X: 'sega32x',
  SEGA_SATURN: 'saturn',
  SEGA_DREAMCAST: 'dreamcast',
  SEGA_GAME_GEAR: 'gamegear',

  // Atari
  ATARI_2600: 'atari2600',
  ATARI_5200: 'atari5200',
  ATARI_7800: 'atari7800',
  ATARI_JAGUAR: 'jaguar',
  ATARI_LYNX: 'lynx',

  // NEC / PC Engine
  NEC_PC_ENGINE: 'pce',
  NEC_PC_ENGINE_CD: 'pcecd',
  NEC_SUPERGRAFX: 'supergrafx',

  // SNK
  SNK_NEO_GEO: 'neogeo',
  SNK_NEO_GEO_POCKET: 'ngp',
  SNK_NEO_GEO_POCKET_COLOR: 'ngpc',

  // Commodore
  COMMODORE_64: 'c64',
  COMMODORE_AMIGA: 'amiga',

  // Others
  BANDAI_WONDERSWAN: 'wonderswan',
  BANDAI_WONDERSWAN_COLOR: 'wonderswancolor',
  GCE_VECTREX: 'vectrex',
  MAGNAVOX_ODYSSEY_2: 'odyssey2'
}

const CONSOLE_MAPPING = {
  // Nintendo
  'Nintendo - Game Boy': 'gb',
  'Nintendo - Game Boy Color': 'gbc',
  'Nintendo - Game Boy Advance': 'gba',
  'Nintendo - Nintendo Entertainment System': 'nes',
  'Nintendo - Super Nintendo Entertainment System': 'snes',
  'Nintendo - Nintendo 64': 'n64',
  'Nintendo - GameCube': 'gc',
  'Nintendo - Wii': 'wii',
  'Nintendo - Wii U': 'wiiu',
  'Nintendo - Nintendo DS': 'nds',
  'Nintendo - Nintendo 3DS': '3ds',
  'Nintendo - Virtual Boy': 'vb',
  'Nintendo - Switch': 'switch',

  // Sony
  'Sony - PlayStation': 'ps1',
  'Sony - PlayStation 2': 'ps2',
  'Sony - PlayStation 3': 'ps3',
  'Sony - PlayStation Portable': 'psp',
  'Sony - PlayStation Vita': 'psvita',

  // Sega
  'Sega - Master System': 'sms',
  'Sega - Mega Drive - Genesis': 'genesis',
  'Sega - Sega CD': 'segacd',
  'Sega - 32X': 'sega32x',
  'Sega - Saturn': 'saturn',
  'Sega - Dreamcast': 'dreamcast',
  'Sega - Game Gear': 'gamegear',

  // Atari
  'Atari - 2600': 'atari2600',
  'Atari - 5200': 'atari5200',
  'Atari - 7800': 'atari7800',
  'Atari - Jaguar': 'jaguar',
  'Atari - Lynx': 'lynx',

  // NEC / PC Engine
  'NEC - PC Engine': 'pce',
  'NEC - PC Engine CD': 'pcecd',
  'NEC - SuperGrafx': 'supergrafx',

  // SNK
  'SNK - Neo Geo': 'neogeo',
  'SNK - Neo Geo Pocket': 'ngp',
  'SNK - Neo Geo Pocket Color': 'ngpc',

  // Commodore
  'Commodore - 64': 'c64',
  'Commodore - Amiga': 'amiga',

  // Others
  'Bandai - WonderSwan': 'wonderswan',
  'Bandai - WonderSwan Color': 'wonderswancolor',
  'GCE - Vectrex': 'vectrex',
  'Magnavox - Odyssey2': 'odyssey2'
}

/**
 * Returns console enum or "unknown"
 */
function getConsoleFromSystem(systemName) {
  return CONSOLE_MAPPING[systemName] || 'unknown'
}

module.exports = {
  CONSOLE_MAPPING,
  CONSOLES,
  getConsoleFromSystem
}
