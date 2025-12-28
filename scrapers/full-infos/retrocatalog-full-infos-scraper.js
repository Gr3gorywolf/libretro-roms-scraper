const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const { CONSOLES } = require("../../constants/console-mapping");
const { normalizeString } = require("../../utils/utils");

const CONSOLE_MAP = {
  [CONSOLES.SEGA_DREAMCAST]: "dreamcast",
  [CONSOLES.NINTENDO_GAME_BOY]: "gb",
  [CONSOLES.NINTENDO_GAME_BOY_ADVANCE]: "gba",
  [CONSOLES.NINTENDO_GAME_BOY_COLOR]: "gbc",
  [CONSOLES.SEGA_GAME_GEAR]: "gamegear",
  [CONSOLES.NINTENDO_GAMECUBE]: "gamecube",
  [CONSOLES.NINTENDO_NES]: "nes",
  [CONSOLES.NINTENDO_3DS]: "3ds",
  [CONSOLES.NINTENDO_64]: "n64",
  [CONSOLES.NINTENDO_DS]: "ds",
  [CONSOLES.NINTENDO_WII]: "wii",
  [CONSOLES.SONY_PLAYSTATION]: "ps1",
  [CONSOLES.SONY_PLAYSTATION_2]: "ps2",
  [CONSOLES.SONY_PSP]: "psp",
  [CONSOLES.SEGA_SATURN]: "saturn",
  [CONSOLES.NINTENDO_SNES]: "snes",
};

const romsMap = {};

var convertToCover = (rom, console) => {
  return {
    titleNormalized: normalizeString(rom.fullName),
    title: rom.fullName,
    size: "0",
    logo: null,
    title_image: null,
    portrait: "https://images.igdb.com/igdb/image/upload/t_cover_big/" + rom.cover,
    gameplay_covers: [],
    console: console,
  };
};

var convertToGameInfo = (rom, console) => {
  return {
    slug: console + "-" + normalizeString(rom.fullName),
    name: rom.fullName,
    developer: "",
    publisher: "",
    releaseDate: "",
    detailsUrl: `https://retrocatalog.com/games/${rom.id}`,
    console: console,
    portrait: "https://images.igdb.com/igdb/image/upload/t_cover_big/" + rom.cover,
    logo: null,
    titleImage: null,
    gameplayCovers: [],
  };
};

async function Scrape(consoleSlug, type = "cover") {
  const foundSlug = CONSOLE_MAP[consoleSlug];
  if (!foundSlug) {
    console.error(`retrocatalog: ✘ Console slug '${consoleSlug}' not supported.`);
    return null;
  }

  if (romsMap[consoleSlug]) {
    return romsMap[consoleSlug].map((rom) => {
      if (type == "cover") {
        return convertToCover(rom, consoleSlug);
      } else if (type == "info") {
        return convertToGameInfo(rom, consoleSlug);
      }
    });
  }

  const url = "https://retrocatalog.com/games/consoles/" + foundSlug;
  var html = "";
  try {
    const { data } = await axios.get(url);
    html = data.data;
  } catch (e) {
    html = e.response.data;
  }

  const $ = cheerio.load(html);
  let buffer = "";

  $("script").each((_, el) => {
    const text = $(el).html() || "";

    if (text.includes("self.__next_f.push")) {
      const match = text.match(/self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/);

      if (match) {
        try {
          const unescaped = JSON.parse(`"${match[1]}"`);
          buffer += unescaped;
        } catch {}
      }
    }
  });

  const gamesMatch = buffer.match(/"gamesSearchList":(\{[\s\S]*?\})(?=,")/);

  if (!gamesMatch) return [];

  const gamesSearchList = JSON.parse(gamesMatch[1]);

  const consoleSlugs = {};
  for (let [key, value] of Object.entries(CONSOLE_MAP)) {
    var slug = value.split(",")[0];
    if (slug == "gamecube") {
      slug = "gc";
    }
    if (slug == "ds") {
      slug = "nds";
    }
    if (slug == "dreamcast") {
      slug = "dc";
    }
    consoleSlugs[slug] = key;
  }
  for (const game of gamesSearchList.alphabetical) {
    var gameConsoleSlug = consoleSlugs[game.s.split(",")[0].toLowerCase()];
    romsMap[gameConsoleSlug] = [...(romsMap[gameConsoleSlug] || []), game];
  }
  console.log(`retrocatalog: ✔ Retrieved ${romsMap[consoleSlug].length} games.`);
  return romsMap[consoleSlug].map((rom) => {
    if (type == "cover") {
      return convertToCover(rom, consoleSlug);
    } else if (type == "info") {
      return convertToGameInfo(rom, consoleSlug);
    }
  });
}

module.exports = {
  Scrape,
  meta: {
    hasCovers: true,
    name: "Retrocatalog Covers & infos",
    author: "gr3",
  },
};
