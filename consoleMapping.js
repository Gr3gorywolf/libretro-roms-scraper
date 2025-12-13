/**
 * Maps libretro-thumbnails system folder names
 * to your internal console enum
 */

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
  getConsoleFromSystem
}
