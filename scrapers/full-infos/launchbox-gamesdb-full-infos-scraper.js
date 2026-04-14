const axios = require("axios");
const cheerio = require("cheerio");
const { CONSOLES } = require("../../constants/console-mapping");
const { normalizeString, normalizeDate } = require("../../utils/utils");
const { CONSOLE_LOGOS } = require("../../constants/console-logos");

const BASE = "https://gamesdb.launchbox-app.com/platforms/games";
const CONSOLE_MAPPINGS = {
  [CONSOLES.THREE_DO]: "1-3do-interactive-multiplayer",
  [CONSOLES.AMSTRAD_CPC]: "3-amstrad-cpc",
  [CONSOLES.APPLE_II]: "111-apple-ii",
  [CONSOLES.ARCADIA_2001]: "79-emerson-arcadia-2001",
  [CONSOLES.ARDUBOY]: "226-arduboy",
  [CONSOLES.NINTENDO_GAME_BOY]: "28-nintendo-game-boy",
  [CONSOLES.NINTENDO_GAME_BOY_COLOR]: "30-nintendo-game-boy-color",
  [CONSOLES.NINTENDO_GAME_BOY_ADVANCE]: "29-nintendo-game-boy-advance",
  [CONSOLES.NINTENDO_NES]: "27-nintendo-entertainment-system",
  [CONSOLES.NINTENDO_SNES]: "53-super-nintendo-entertainment-system",
  [CONSOLES.NINTENDO_64]: "25-nintendo-64",
  [CONSOLES.NINTENDO_GAMECUBE]: "31-nintendo-gamecube",
  [CONSOLES.NINTENDO_WII]: "33-nintendo-wii",
  [CONSOLES.NINTENDO_WII_U]: "34-nintendo-wii-u",
  [CONSOLES.NINTENDO_DS]: "26-nintendo-ds",
  [CONSOLES.NINTENDO_3DS]: "24-nintendo-3ds",
  [CONSOLES.NINTENDO_VIRTUAL_BOY]: "32-nintendo-virtual-boy",
  [CONSOLES.NINTENDO_SWITCH]: "211-nintendo-switch", 
  [CONSOLES.NINTENDO_SATELLAVIEW]: "168-nintendo-satellaview",
  [CONSOLES.NINTENDO_GAME_AND_WATCH]: "166-nintendo-game-watch",
  [CONSOLES.FAMICOM_DISK_SYSTEM]: "157-nintendo-famicom-disk-system",
  [CONSOLES.POKEMON_MINI]: "195-nintendo-pokemon-mini",

  // Sony Consoles
  [CONSOLES.SONY_PLAYSTATION]: "47-sony-playstation",
  [CONSOLES.SONY_PLAYSTATION_2]: "48-sony-playstation-2",
  [CONSOLES.SONY_PLAYSTATION_3]: "49-sony-playstation-3",
  [CONSOLES.SONY_PSP]: "52-sony-psp",
  [CONSOLES.SONY_PLAYSTATION_VITA]: "51-sony-playstation-vita",
  [CONSOLES.SONY_PSP_MINIS]: "202-sony-psp-minis",

  // Microsoft Consoles
  [CONSOLES.XBOX]: "18-microsoft-xbox",
  [CONSOLES.XBOX_360]: "19-microsoft-xbox-360",

  // Sega Consoles
  [CONSOLES.SEGA_MASTER_SYSTEM]: "43-sega-master-system",
  [CONSOLES.SEGA_GENESIS]: "42-sega-genesis",
  [CONSOLES.SEGA_CD]: "39-sega-cd",
  [CONSOLES.SEGA_32X]: "173-sega-cd-32x",
  [CONSOLES.SEGA_SATURN]: "45-sega-saturn",
  [CONSOLES.SEGA_DREAMCAST]: "40-sega-dreamcast",
  [CONSOLES.SEGA_GAME_GEAR]: "41-sega-game-gear",
  [CONSOLES.SEGA_SG_1000]: "80-sega-sg-1000",
  [CONSOLES.SEGA_NAOMI]: "99-sega-naomi",
  [CONSOLES.SEGA_MODEL_3]: "94-sega-model-3",
  [CONSOLES.SEGA_PICO]: "105-sega-pico",
  [CONSOLES.ATOMISWAVE]: "98-sammy-atomiswave",

  // Atari Consoles
  [CONSOLES.ATARI_2600]: "6-atari-2600",
  [CONSOLES.ATARI_5200]: "7-atari-5200",
  [CONSOLES.ATARI_7800]: "8-atari-7800",
  [CONSOLES.ATARI_JAGUAR]: "9-atari-jaguar",
  [CONSOLES.ATARI_LYNX]: "11-atari-lynx",
  [CONSOLES.ATARI_JAGUAR_CD]: "10-atari-jaguar-cd",
  [CONSOLES.ATARI_ST]: "76-atari-st",

  //PC-ENGINE
  [CONSOLES.TURBOGRAFX_16]: "54-nec-turbografx-16",
  [CONSOLES.TURBOGRAFX_CD]: "163-nec-turbografx-cd",
  [CONSOLES.SUPERGRAFX]: "162-pc-engine-supergrafx",
  [CONSOLES.NEC_PC_ENGINE]: "162-pc-engine-supergrafx",
  [CONSOLES.NEC_PC_ENGINE_CD]: "163-nec-turbografx-cd",
  [CONSOLES.NEC_SUPERGRAFX]: "162-pc-engine-supergrafx",
  [CONSOLES.NEC_PC_FX]: "161-nec-pc-fx",
  [CONSOLES.NEC_PC_88]: "192-nec-pc-8801",
  [CONSOLES.NEC_PC_98]: "193-nec-pc-9801",

  // SNK
  [CONSOLES.SNK_NEO_GEO]: "210-snk-neo-geo-mvs",
  [CONSOLES.SNK_NEO_GEO_POCKET]: "21-snk-neo-geo-pocket",
  [CONSOLES.SNK_NEO_GEO_POCKET_COLOR]: "22-snk-neo-geo-pocket-color",
  [CONSOLES.NEO_GEO_CD]: "167-snk-neo-geo-cd",

  // COMMODORE
  [CONSOLES.COMMODORE_64]: "14-commodore-64",
  [CONSOLES.COMMODORE_AMIGA]: "2-commodore-amiga",
  [CONSOLES.COMMODORE_PET]: "181-commodore-pet",
  [CONSOLES.COMMODORE_PLUS_4]: "121-commodore-plus-4",
  [CONSOLES.VIC_20]: "122-commodore-vic-20",

  //OTHERS
  [CONSOLES.WINDOWS]: "84-windows",
  [CONSOLES.BANDAI_WONDERSWAN]: "55-wonderswan",
  [CONSOLES.BANDAI_WONDERSWAN_COLOR]: "56-wonderswan-color",
  [CONSOLES.GCE_VECTREX]: "125-gce-vectrex",
  [CONSOLES.MAGNAVOX_ODYSSEY_2]: "57-magnavox-odyssey-2",
  [CONSOLES.COLECOVISION]: "13-colecovision",
  [CONSOLES.INTELLIVISION]: "15-mattel-intellivision",
  [CONSOLES.FAIRCHILD_CHANNEL_F]: "58-fairchild-channel-f",
  [CONSOLES.ACORN_BBC_MICRO]: "59-bbc-microcomputer-system",
  [CONSOLES.MSX]: "82-microsoft-msx",
  [CONSOLES.DOS]: "83-ms-dos",
  [CONSOLES.INTERTON_VC_4000]: "137-interton-vc-4000",
  [CONSOLES.MEGA_DUCK]: "127-mega-duck",
  [CONSOLES.ELEKTOR_TV_GAMES_COMPUTER]: "225-elektor-tv-games-computer",
  [CONSOLES.PHILIPS_CD_I]: "37-philips-cd-i",
  [CONSOLES.SCUMMVM]: "143-scummvm",
  [CONSOLES.SHARP_X1]: "204-sharp-x1",
  [CONSOLES.SHARP_X68000]: "128-sharp-x68000",
  [CONSOLES.TRIFORCE]: "207-sega-triforce",
  [CONSOLES.UZEBOX]: "227-uzebox",
  [CONSOLES.WASM_4]: "228-wasm-4",
  [CONSOLES.WATARA_SUPERVISION]: "153-watara-supervision",
  [CONSOLES.ZX_81]: "147-sinclair-zx-81",
  [CONSOLES.ZX_SPECTRUM]: "46-sinclair-zx-spectrum",
};

const getHtml = async (url) => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};

async function scrapePage(consoleSlug, page) {
  const games = [];
  const detailUrl = `${BASE}/${CONSOLE_MAPPINGS[consoleSlug]}/page/${page}`;
  const $ = await getHtml(detailUrl);

  $("a.list-item.link-no-underline").each((_, el) => {
    const card = $(el);

    const href = card.attr("href") || "";
    const name = card.find(".cardTitle h3").text().trim();
    const portrait = card.find(".imgOver img").attr("src") || null;
    const gameplay = card.find(".cardImgPart > img").attr("src") || null;

    const rating = card.find('[id^="communityRating"]').text().trim() || "";

    const year = card.find(".releaseDate h5").text().trim() || "";

    const slug = href
      .split("/")
      .filter(Boolean)
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    games.push({
      slug: `${consoleSlug}-${normalizeString(name)}`,
      name: name,
      developer: "",
      publisher: "",
      releaseDate: normalizeDate(year),
      rating: rating || "",
      detailsUrl: `https://gamesdb.launchbox-app.com${href}`,
      console: consoleSlug,
      portrait: portrait,
      logo: null,
      titleImage: null,
      gameplayCovers: gameplay ? [gameplay] : [],
    });
  });
  return games;
}

async function Scrape(consoleSlug) {
  if (!CONSOLE_MAPPINGS[consoleSlug]) {
    console.error(`launchbox-gamesdb: ✘ Console slug '${consoleSlug}' not supported.`);
    return null;
  }
  try{
     const result = {
    console: {
      name: "",
      slug: "",
      logoUrl: CONSOLE_LOGOS[consoleSlug],
      description: "",
    },
    sourceName: "",
    games: [],
  };
  const $ = await getHtml(`${BASE}/${CONSOLE_MAPPINGS[consoleSlug]}`);

  const hero = $(".platform-hero.heading");
  result.console.name = hero.find("h1").text().trim();
  result.console.slug = consoleSlug;

  result.console.description = hero.find("p").text().trim();

  let lastPage = 1;
 $('script').each((_, el) => {
    const text = $(el).html() || "";
    if (text.includes('$(".pagination-lg").pagination')) {
      const match = text.match(/pages\s*:\s*(\d+)/);
      if (match) {
        lastPage = parseInt(match[1], 10);
      }
    }
  });
  for (let p = 1; p <= lastPage; p++) {
    console.log(`launchbox-gamesdb: Scraping page ${p} for console '${consoleSlug}'...`);
    result.games.push(...(await scrapePage(consoleSlug, p)));
  }

  return result;
  }catch(err){
    console.error(`launchbox-gamesdb: ✘ Error scraping console '${consoleSlug}': ${err.message}`);
    return null;
  }
 
}

module.exports = {
  Scrape,
  meta: {
    hasCovers: true,
    name: "LaunchBox GamesDB Full Infos",
    author: "gr3",
  },
};
