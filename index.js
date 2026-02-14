require("dotenv").config();
const fs = require("fs-extra");
const path = require("path");
const { normalizeString, wordSimilarity } = require("./utils/utils");
const { LocalScrapeInfos, WikipediaScrapeInfos, RetroCatalogsInfos } = require("./scrapers/infos");
const { LibretroScrapeCovers, NswpediaScrapeCovers, PushSquareCovers } = require("./scrapers/covers");
const { CONSOLES } = require("./constants/console-mapping");
const { CONSOLE_LOGOS } = require("./constants/console-logos");
const { LaunchboxGamesDBFullInfos } = require("./scrapers/full-infos");
const { DaijishowScrapeIntents } = require("./scrapers/intents");

const SCRAPERS_SETTINGS = {
  // ================================
  // 🟢 NINTENDO
  // ================================

  // NES — Nintendo (1983/1985)
  [CONSOLES.NINTENDO_NES]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Game Boy — Nintendo (1989)
  [CONSOLES.NINTENDO_GAME_BOY]: {
   covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Super Nintendo — Nintendo (1990)
  [CONSOLES.NINTENDO_SNES]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Virtual Boy — Nintendo (1995)
  [CONSOLES.NINTENDO_VIRTUAL_BOY]: {
   covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Nintendo 64 — Nintendo (1996)
  [CONSOLES.NINTENDO_64]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Game Boy Color — Nintendo (1998)
  [CONSOLES.NINTENDO_GAME_BOY_COLOR]: {
     covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Game Boy Advance — Nintendo (2001)
  [CONSOLES.NINTENDO_GAME_BOY_ADVANCE]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // GameCube — Nintendo (2001)
  [CONSOLES.NINTENDO_GAMECUBE]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Nintendo DS — Nintendo (2004)
  [CONSOLES.NINTENDO_DS]: {
   covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Wii — Nintendo (2006)
  [CONSOLES.NINTENDO_WII]: {
     covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Nintendo 3DS — Nintendo (2011)
  [CONSOLES.NINTENDO_3DS]: {
     covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Wii U — Nintendo (2012)
  [CONSOLES.NINTENDO_WII_U]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Switch — Nintendo (2017)
  [CONSOLES.NINTENDO_SWITCH]: {
    covers: [NswpediaScrapeCovers],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // ================================
  // 🔵 SONY / PLAYSTATION
  // ================================

  // PlayStation — Sony (1994)
  [CONSOLES.SONY_PLAYSTATION]: {
   covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // PlayStation 2 — Sony (2000)
  [CONSOLES.SONY_PLAYSTATION_2]: {
   covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // PSP — Sony (2004)
  [CONSOLES.SONY_PSP]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // PlayStation 3 — Sony (2006)
  [CONSOLES.SONY_PLAYSTATION_3]: {
  covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // PS Vita — Sony (2011)
  [CONSOLES.SONY_PLAYSTATION_VITA]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // ================================
  //  Microsoft
  // ================================
 [CONSOLES.XBOX]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  [CONSOLES.XBOX_360]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  [CONSOLES.WINDOWS]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // ================================
  // 🟠 SEGA
  // ================================

  // Sega Genesis / Mega Drive (1988)
  [CONSOLES.SEGA_GENESIS]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Game Gear (1990)
  [CONSOLES.SEGA_GAME_GEAR]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // 32X (1994)
  [CONSOLES.SEGA_32X]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Saturn (1994)
  [CONSOLES.SEGA_SATURN]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Dreamcast (1998/1999)
  [CONSOLES.SEGA_DREAMCAST]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // ================================
  // 🔴 SNK
  // ================================

  // Neo Geo AES (1990)
  [CONSOLES.SNK_NEO_GEO]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Neo Geo Pocket (1998)
  [CONSOLES.SNK_NEO_GEO_POCKET]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Neo Geo Pocket Color (1999)
  [CONSOLES.SNK_NEO_GEO_POCKET_COLOR]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // ================================
  // 🟡 BANDAI
  // ================================

  // WonderSwan (1999)
  [CONSOLES.BANDAI_WONDERSWAN]: {
     covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // WonderSwan Color (2000)
  [CONSOLES.BANDAI_WONDERSWAN_COLOR]: {
   covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // ================================
  // 🟤 COMMODORE
  // ================================

  // Commodore 64 (1982)
  [CONSOLES.COMMODORE_64]: {
   covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Amiga (1985)
  [CONSOLES.COMMODORE_AMIGA]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // ================================
  // ⚫ OTHERS
  // ================================

  // Vectrex — GCE (1982)
  [CONSOLES.GCE_VECTREX]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  // Magnavox Odyssey² — Magnavox/Philips (1978)
  [CONSOLES.MAGNAVOX_ODYSSEY_2]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
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
  const intentsPath = path.join(__dirname, "output", "intents");
  await fs.mkdirSync(infosPath, { recursive: true });
  await fs.mkdirSync(coversPath, { recursive: true });
  await fs.mkdirSync(intentsPath, { recursive: true });
  var args = process.argv.slice(2);
  const shouldScrapeIntents = args.some((arg) => arg.includes("--intents"));
  const shouldSkipCache = args.some((arg) => arg.includes("--skip-cache"));
  let sourceName = args.find((arg) => arg.startsWith("--name="));
  const allowedConsolesStr = args.find((arg) => arg.startsWith("--consoles="));
  let allowedConsoleList = [];
  if (allowedConsolesStr) {
    allowedConsoleList = allowedConsolesStr.replace("--consoles=", "").split(",");
  }
  if(sourceName){
    sourceName = sourceName.split("=")[1];
  }
  if (shouldScrapeIntents) {
    console.log("Main scraper: Retrieving intents");
    var intentsFile = await DaijishowScrapeIntents.Scrape();
    console.log("Main scraper: Saving intents");
    await fs.writeJson(intentsPath + "/daijishou-intents.json", intentsFile);
    return;
  }

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
    if (fs.existsSync(coverFileName) && !shouldSkipCache) {
      coverCache = JSON.parse(fs.readFileSync(coverFileName, "utf-8"));
      allCovers = coverCache;
    }

    const useCache = coverCache && !shouldSkipCache;
    if (coverScrapers.length > 0) {
      console.log("Main scraper: Retrieving covers");
      for (const scraper of coverScrapers) {
        const covers = await scraper.Scrape(consoleSlug);
        if (!covers || covers.length === 0) {
          console.warn(`Main scraper: ⚠ No covers found for console slug: ${consoleSlug} on scraper ${scraper.meta?.name || "unknown"}`);
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
      console.log(`Main scraper: ✔ Retrieved ${Object.keys(allCovers).length} covers for console slug: ${consoleSlug} ${useCache ? "(from cache)" : ""}`);
    }
    for (const scraper of infoScrapers) {
      const infos = await scraper.Scrape(consoleSlug);
      if (!infos || !infos?.games || infos?.games?.length === 0) {
        console.warn(`Main scraper: ⚠ No infos found for console slug: ${consoleSlug} on scraper ${scraper.meta?.name || "unknown"}`);
        continue;
      }
      if (infos.console && !allInfos.console) {
        allInfos.console = infos.console;
      }
      for (const game of infos.games) {
        const key = normalizeString(game.slug);
        if (!key) {
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
    let enrichedGames = allInfos.games;
    if (coverScrapers.length > 0) {
      enrichedGames = allInfos.games.map((game) => {
        const bestCover = findBestCover(Object.values(allCovers), normalizeString(game.name), 0.7);
        const bestCoverPortrait = bestCover ? bestCover.portrait || bestCover.image || null : null;
        const bestCoverLogo = bestCover ? bestCover.logo || null : null;
        const bestCoverTitleImage = bestCover ? bestCover.title_image || null : null;
        const bestCoverGameplay = bestCover && bestCover.gameplay_covers && bestCover.gameplay_covers.length > 0 ? bestCover.gameplay_covers : [];
        return {
          ...game,
          portrait:game.portrait ??  bestCoverPortrait,
          logo:game.logo ?? bestCoverLogo,
          titleImage: game.titleImage ?? bestCoverTitleImage,
          gameplayCovers:game.gameplayCovers.length ? game.gameplayCovers : bestCoverGameplay,
        };
      });
    }
    if (CONSOLE_LOGOS[consoleSlug]) {
      allInfos.console.logo = CONSOLE_LOGOS[consoleSlug];
    }
    const outFile = path.join(infosPath, `${consoleSlug}.json`);
    await fs.writeJson(outFile, {
      console: allInfos.console,
      sourceName: sourceName ?? allInfos.console.name,
      games: enrichedGames,
    });
    console.log(`Main scraper: ✔ Saved enriched data for console slug: ${consoleSlug} to ${outFile}`);
  }
}

run();
