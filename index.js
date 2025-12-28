require('dotenv').config() 
const fs = require("fs-extra");
const path = require("path");
const { normalizeString, wordSimilarity } = require("./utils/utils");
const { LocalScrapeInfos, WikipediaScrapeInfos } = require("./scrapers/infos");
const { LibretroScrapeCovers, NswpediaScrapeCovers } = require("./scrapers/covers");
const { CONSOLES } = require("./constants/console-mapping");
const { CONSOLE_LOGOS } = require("./constants/console-logos");

const SCRAPERS_SETTINGS = {
  // ================================
  // 🟢 NINTENDO
  // ================================

  // NES — Nintendo (1983/1985)
  [CONSOLES.NINTENDO_NES]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Game Boy — Nintendo (1989)
  [CONSOLES.NINTENDO_GAME_BOY]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Super Nintendo — Nintendo (1990)
  [CONSOLES.NINTENDO_SNES]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Virtual Boy — Nintendo (1995)
  [CONSOLES.NINTENDO_VIRTUAL_BOY]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Nintendo 64 — Nintendo (1996)
  [CONSOLES.NINTENDO_64]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Game Boy Color — Nintendo (1998)
  [CONSOLES.NINTENDO_GAME_BOY_COLOR]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Game Boy Advance — Nintendo (2001)
  [CONSOLES.NINTENDO_GAME_BOY_ADVANCE]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // GameCube — Nintendo (2001)
  [CONSOLES.NINTENDO_GAMECUBE]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Nintendo DS — Nintendo (2004)
  [CONSOLES.NINTENDO_DS]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Wii — Nintendo (2006)
  [CONSOLES.NINTENDO_WII]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Nintendo 3DS — Nintendo (2011)
  [CONSOLES.NINTENDO_3DS]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Wii U — Nintendo (2012)
  [CONSOLES.NINTENDO_WII_U]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Switch — Nintendo (2017)
  [CONSOLES.NINTENDO_SWITCH]: {
    covers: [NswpediaScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // ================================
  // 🔵 SONY / PLAYSTATION
  // ================================

  // PlayStation — Sony (1994)
  [CONSOLES.SONY_PLAYSTATION]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // PlayStation 2 — Sony (2000)
  [CONSOLES.SONY_PLAYSTATION_2]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // PSP — Sony (2004)
  [CONSOLES.SONY_PSP]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // PlayStation 3 — Sony (2006)
  [CONSOLES.SONY_PLAYSTATION_3]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // PS Vita — Sony (2011)
  [CONSOLES.SONY_PLAYSTATION_VITA]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // ================================
  // 🟠 SEGA
  // ================================

  // Sega Genesis / Mega Drive (1988)
  [CONSOLES.SEGA_GENESIS]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Game Gear (1990)
  [CONSOLES.SEGA_GAME_GEAR]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // 32X (1994)
  [CONSOLES.SEGA_32X]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Saturn (1994)
  [CONSOLES.SEGA_SATURN]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Dreamcast (1998/1999)
  [CONSOLES.SEGA_DREAMCAST]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // ================================
  // 🔴 SNK
  // ================================

  // Neo Geo AES (1990)
  [CONSOLES.SNK_NEO_GEO]: {
    covers: [LibretroScrapeCovers],
    infos: [LocalScrapeInfos],
  },

  // Neo Geo Pocket (1998)
  [CONSOLES.SNK_NEO_GEO_POCKET]: {
    covers: [LibretroScrapeCovers],
    infos: [LocalScrapeInfos],
  },

  // Neo Geo Pocket Color (1999)
  [CONSOLES.SNK_NEO_GEO_POCKET_COLOR]: {
    covers: [LibretroScrapeCovers],
    infos: [LocalScrapeInfos],
  },

  // ================================
  // 🟡 BANDAI
  // ================================

  // WonderSwan (1999)
  [CONSOLES.BANDAI_WONDERSWAN]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // WonderSwan Color (2000)
  [CONSOLES.BANDAI_WONDERSWAN_COLOR]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // ================================
  // 🟤 COMMODORE
  // ================================

  // Commodore 64 (1982)
  [CONSOLES.COMMODORE_64]: {
    covers: [LibretroScrapeCovers],
    infos: [LocalScrapeInfos],
  },

  // Amiga (1985)
  [CONSOLES.COMMODORE_AMIGA]: {
    covers: [LibretroScrapeCovers],
    infos: [LocalScrapeInfos],
  },

  // ================================
  // ⚫ OTHERS
  // ================================

  // Vectrex — GCE (1982)
  [CONSOLES.GCE_VECTREX]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },

  // Magnavox Odyssey² — Magnavox/Philips (1978)
  [CONSOLES.MAGNAVOX_ODYSSEY_2]: {
    covers: [LibretroScrapeCovers],
    infos: [WikipediaScrapeInfos],
  },
};

function findBestCover(romCovers, normalizedTitle, threshold = 0.8) {
  const title = normalizedTitle;

  let bestMatch = null;
  let bestScore = 0;

  for (const cover of romCovers) {
    const coverTitle = normalizeString(cover.title || cover.normalizedTitle);
    const lengthRatio = Math.min(title.length, coverTitle.length) / Math.max(title.length, coverTitle.length);
    if (lengthRatio < 0.6) continue;

    const wordScore = wordSimilarity(title, coverTitle);

    if (wordScore >= threshold && wordScore > bestScore) {
      bestScore = wordScore;
      bestMatch = cover;
    }
  }

  return bestMatch;
}

async function run() {
  const coversPath = path.join(__dirname, "output", "covers");
  const infosPath = path.join(__dirname, "output", "infos");
  await fs.mkdirSync(infosPath, { recursive: true });
  await fs.mkdirSync(coversPath, { recursive: true });
  var args = process.argv.slice(2);

  const shouldSkipCache = args.some((arg)=>arg.includes("--skip-cache"));
  const allowedConsolesStr = args.find((arg)=>arg.startsWith("--consoles="));
  let allowedConsoleList = [];
  if (allowedConsolesStr) {
      allowedConsoleList = allowedConsolesStr.replace("--consoles=", "").split(",");
  }


  console.log("Main scraper: Retrieving covers");
  for (const consoleSlug of Object.keys(SCRAPERS_SETTINGS)) {
    if (allowedConsoleList.length > 0 && !allowedConsoleList.includes(consoleSlug)) {
      continue;
    }
    const consoleSettings = SCRAPERS_SETTINGS[consoleSlug];
    const coverScrapers = consoleSettings.covers || [];
    const infoScrapers = consoleSettings.infos || [];
    let allCovers = {};
    let allGames = {};
    let allInfos = {
      console: null,
      games: [],
    };
    const coverFileName = path.join(coversPath, `${consoleSlug}.json`);
    let coverCache = null;
    if (fs.existsSync(coverFileName)) {
      coverCache = JSON.parse(fs.readFileSync(coverFileName, "utf-8"));
      allCovers = coverCache;
    }
    const useCache = !coverCache || shouldSkipCache
    if (useCache) {
      for (const scraper of coverScrapers) {
        const covers = await scraper(consoleSlug);
        if (!covers || covers.length === 0) {
          console.warn(`Main scraper: ⚠ No covers found for console slug: ${consoleSlug}`);
          continue;
        }
        for (const cover of covers) {
          const key = normalizeString(cover.title || cover.normalizedTitle);
          if (!allCovers[key] || !allCovers[key].portrait) {
            allCovers[key] = cover;
          }
        }
      }
      await fs.writeJson(coverFileName, allCovers);
    }
    console.log(`Main scraper: ✔ Retrieved ${Object.keys(allCovers).length} covers for console slug: ${consoleSlug} ${useCache ? '(from cache)' : ''}`);
    for (const scraper of infoScrapers) {
      const infos = await scraper(consoleSlug);
      if (!infos || !infos?.games || infos?.games?.length === 0) {
        console.warn(`Main scraper: ⚠ No infos found for console slug: ${consoleSlug}`);
        continue;
      }
      if (infos.console && !allInfos.console) {
        allInfos.console = infos.console;
      }
      for (const game of infos.games) {
        const key = normalizeString(game.slug);
        if(!key){
          continue;
        }
        if (!allGames[key]) {
          allGames[key] = game;
        } else {
          const prevGame = allGames[key];
          allGames[key] = {
            ...prevGame,
            ...game,
            ...(!prevGame.portrait && game.portrait ? { portrait: game.portrait } : {}),
          };
        }
      }
    }
    allInfos.games = Object.values(allGames);
    console.log(`Main scraper: ✔ Retrieved ${allInfos.games.length} infos for console slug: ${consoleSlug}`);
    // Now match covers to infos
    const enrichedGames = allInfos.games.map((game) => {
      const bestCover = findBestCover(Object.values(allCovers),normalizeString(game.name) , 0.7);
      return {
        ...game,
        portrait: bestCover ? bestCover.portrait || bestCover.image || null : null,
        logo: bestCover ? bestCover.logo || null : null,
        titleImage: bestCover ? bestCover.title_image || null : null,
        gameplayCovers: bestCover ? bestCover.gameplay_covers || [] : [],
      };
    });
    if (CONSOLE_LOGOS[consoleSlug]) {
      allInfos.console.logo = CONSOLE_LOGOS[consoleSlug];
    }
    const outFile = path.join(infosPath, `${consoleSlug}.json`);
    await fs.writeJson(outFile, {
      console: allInfos.console,
      games: enrichedGames,
    });
    console.log(`Main scraper: ✔ Saved enriched data for console slug: ${consoleSlug} to ${outFile}`);
  }
}

run();
