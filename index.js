require("dotenv").config();
const fs = require("fs-extra");
const path = require("path");
const { normalizeString, wordSimilarity } = require("./utils/utils");
const {
  LocalScrapeInfos,
  WikipediaScrapeInfos,
  RetroCatalogsInfos,
} = require("./scrapers/infos");
const {
  LibretroScrapeCovers,
  NswpediaScrapeCovers,
  PushSquareCovers,
} = require("./scrapers/covers");
const { CONSOLES } = require("./constants/console-mapping");
const { CONSOLE_LOGOS } = require("./constants/console-logos");
const { LaunchboxGamesDBFullInfos } = require("./scrapers/full-infos");
const { DaijishowScrapeIntents } = require("./scrapers/intents");

const SCRAPERS_SETTINGS = {
  [CONSOLES.NINTENDO_NES]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NINTENDO_GAME_BOY]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.NINTENDO_SNES]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NINTENDO_VIRTUAL_BOY]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.NINTENDO_64]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NINTENDO_GAME_BOY_COLOR]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.NINTENDO_GAME_BOY_ADVANCE]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.NINTENDO_GAMECUBE]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.NINTENDO_DS]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NINTENDO_WII]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NINTENDO_3DS]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NINTENDO_WII_U]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NINTENDO_SWITCH]: {
    covers: [NswpediaScrapeCovers],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.NINTENDO_SATELLAVIEW]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.NINTENDO_GAME_AND_WATCH]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.FAMICOM_DISK_SYSTEM]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.POKEMON_MINI]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },

  [CONSOLES.SONY_PLAYSTATION]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.SONY_PLAYSTATION_2]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.SONY_PSP]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SONY_PLAYSTATION_3]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.SONY_PLAYSTATION_VITA]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.SONY_PSP_MINIS]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },

  [CONSOLES.XBOX]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.XBOX_360]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.WINDOWS]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },

  [CONSOLES.SEGA_GENESIS]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SEGA_GAME_GEAR]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SEGA_32X]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SEGA_SATURN]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SEGA_DREAMCAST]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SEGA_MASTER_SYSTEM]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.SEGA_SG_1000]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SEGA_NAOMI]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SEGA_MODEL_3]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SEGA_PICO]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.TRIFORCE]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ATOMISWAVE]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },

  [CONSOLES.SNK_NEO_GEO]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SNK_NEO_GEO_POCKET]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.SNK_NEO_GEO_POCKET_COLOR]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.NEO_GEO_CD]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },

  [CONSOLES.BANDAI_WONDERSWAN]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.BANDAI_WONDERSWAN_COLOR]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },

  [CONSOLES.COMMODORE_64]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.COMMODORE_AMIGA]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.COMMODORE_PET]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.COMMODORE_PLUS_4]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.VIC_20]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },

  [CONSOLES.THREE_DO]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.AMSTRAD_CPC]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.APPLE_II]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ARCADIA_2001]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ARDUBOY]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ATARI_2600]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ATARI_5200]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ATARI_7800]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ATARI_JAGUAR]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ATARI_LYNX]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ATARI_ST]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ATARI_JAGUAR_CD]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.TURBOGRAFX_16]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.TURBOGRAFX_CD]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SUPERGRAFX]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NEC_PC_FX]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NEC_PC_88]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.NEC_PC_98]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.COLECOVISION]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.INTELLIVISION]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.FAIRCHILD_CHANNEL_F]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.ACORN_BBC_MICRO]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.MSX]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.DOS]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.INTERTON_VC_4000]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.MEGA_DUCK]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ELEKTOR_TV_GAMES_COMPUTER]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.PHILIPS_CD_I]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SCUMMVM]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SHARP_X1]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.SHARP_X68000]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.UZEBOX]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.WASM_4]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.WATARA_SUPERVISION]: {
    covers: [],
    infos: [LaunchboxGamesDBFullInfos],
  },
  [CONSOLES.ZX_81]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.ZX_SPECTRUM]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
  [CONSOLES.GCE_VECTREX]: { covers: [], infos: [LaunchboxGamesDBFullInfos] },
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
    const lengthRatio =
      Math.min(title.length, coverTitle.length) /
      Math.max(title.length, coverTitle.length);
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
  const retroarchPath = path.join(__dirname, "output", "retroarch");
  await fs.mkdirSync(infosPath, { recursive: true });
  await fs.mkdirSync(coversPath, { recursive: true });
  await fs.mkdirSync(intentsPath, { recursive: true });
  await fs.mkdirSync(retroarchPath, { recursive: true });
  var args = process.argv.slice(2);
  const shouldScrapeIntents = args.some((arg) => arg.includes("--intents"));
  const shouldSkipCache = args.some((arg) => arg.includes("--skip-cache"));
  let sourceName = args.find((arg) => arg.startsWith("--name="));
  const allowedConsolesStr = args.find((arg) => arg.startsWith("--consoles="));
  let allowedConsoleList = [];
  if (allowedConsolesStr) {
    allowedConsoleList = allowedConsolesStr
      .replace("--consoles=", "")
      .split(",");
  }
  if (sourceName) {
    sourceName = sourceName.split("=")[1];
  }
  if (shouldScrapeIntents) {
    console.log("Main scraper: Retrieving intents");
    var intentsFile = await DaijishowScrapeIntents.Scrape();
    console.log("Main scraper: Saving intents");
    await fs.writeJson(intentsPath + "/daijishou-intents.json", intentsFile.results);
    await fs.writeJson(retroarchPath + "/retroarch-cores.json", intentsFile.retroarchCores);
    return;
  }

  for (const consoleSlug of Object.keys(SCRAPERS_SETTINGS)) {
    if (
      allowedConsoleList.length > 0 &&
      !allowedConsoleList.includes(consoleSlug)
    ) {
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
          console.warn(
            `Main scraper: No covers found for console slug: ${consoleSlug} on scraper ${
              scraper.meta?.name || "unknown"
            }`
          );
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
      console.log(
        `Main scraper: Retrieved ${
          Object.keys(allCovers).length
        } covers for console slug: ${consoleSlug} ${
          useCache ? "(from cache)" : ""
        }`
      );
    }
    for (const scraper of infoScrapers) {
      const infos = await scraper.Scrape(consoleSlug);
      if (!infos || !infos?.games || infos?.games?.length === 0) {
        console.warn(
          `Main scraper: No infos found for console slug: ${consoleSlug} on scraper ${
            scraper.meta?.name || "unknown"
          }`
        );
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
            ...(!prevGame.portrait && game.portrait
              ? { portrait: game.portrait }
              : {}),
          };
        }
      }
    }
    allInfos.games = Object.values(allGames);
    console.log(
      `Main scraper: Retrieved ${allInfos.games.length} infos for console slug: ${consoleSlug}`
    );
    let enrichedGames = allInfos.games;
    if (coverScrapers.length > 0) {
      enrichedGames = allInfos.games.map((game) => {
        const bestCover = findBestCover(
          Object.values(allCovers),
          normalizeString(game.name),
          0.7
        );
        const bestCoverPortrait = bestCover
          ? bestCover.portrait || bestCover.image || null
          : null;
        const bestCoverLogo = bestCover ? bestCover.logo || null : null;
        const bestCoverTitleImage = bestCover
          ? bestCover.title_image || null
          : null;
        const bestCoverGameplay =
          bestCover &&
          bestCover.gameplay_covers &&
          bestCover.gameplay_covers.length > 0
            ? bestCover.gameplay_covers
            : [];
        return {
          ...game,
          portrait: game.portrait ?? bestCoverPortrait,
          logo: game.logo ?? bestCoverLogo,
          titleImage: game.titleImage ?? bestCoverTitleImage,
          gameplayCovers: game.gameplayCovers.length
            ? game.gameplayCovers
            : bestCoverGameplay,
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
    console.log(
      `Main scraper: Saved enriched data for console slug: ${consoleSlug} to ${outFile}`
    );
  }
}

run();
