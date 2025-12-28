const axios = require("axios");
const cheerio = require("cheerio");
const { CONSOLES } = require("../../constants/console-mapping");
const { normalizeString, normalizeDate } = require("../../utils/utils");

const BASE = "https://gamesdb.launchbox-app.com/platforms/games";
const CONSOLE_MAPPINGS = {
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
  // Sony Consoles
  [CONSOLES.SONY_PLAYSTATION]: "47-sony-playstation",
  [CONSOLES.SONY_PLAYSTATION_2]: "48-sony-playstation-2",
  [CONSOLES.SONY_PLAYSTATION_3]: "49-sony-playstation-3",
  [CONSOLES.SONY_PSP]: "52-sony-psp",
  [CONSOLES.SONY_PLAYSTATION_VITA]: "51-sony-playstation-vita",

  // Sega Consoles
  [CONSOLES.SEGA_MASTER_SYSTEM]: "43-sega-master-system",
  [CONSOLES.SEGA_GENESIS]: "42-sega-genesis",
  [CONSOLES.SEGA_CD]: "39-sega-cd",
  [CONSOLES.SEGA_32X]: "173-sega-cd-32x",
  [CONSOLES.SEGA_SATURN]: "45-sega-saturn",
  [CONSOLES.SEGA_DREAMCAST]: "40-sega-dreamcast",
  [CONSOLES.SEGA_GAME_GEAR]: "41-sega-game-gear",

  // Atari Consoles
  [CONSOLES.ATARI_2600]: "6-atari-2600",
  [CONSOLES.ATARI_5200]: "7-atari-5200",
  [CONSOLES.ATARI_7800]: "8-atari-7800",
  [CONSOLES.ATARI_JAGUAR]: "9-atari-jaguar",
  [CONSOLES.ATARI_LYNX]: "11-atari-lynx",

  //PC-ENGINE
  [CONSOLES.NEC_PC_ENGINE]: "162-pc-engine-supergrafx",
  [CONSOLES.NEC_PC_ENGINE_CD]: "163-nec-turbografx-cd",
  [CONSOLES.NEC_SUPERGRAFX]: "162-pc-engine-supergrafx",

  // SNK
  [CONSOLES.SNK_NEO_GEO]: "210-snk-neo-geo-mvs",
  [CONSOLES.SNK_NEO_GEO_POCKET]: "21-snk-neo-geo-pocket",
  [CONSOLES.SNK_NEO_GEO_POCKET_COLOR]: "22-snk-neo-geo-pocket-color",

  // COMMODORE
  [CONSOLES.COMMODORE_64]: "14-commodore-64",
  [CONSOLES.COMMODORE_AMIGA]: "2-commodore-amiga",

  //OTHERS
  [CONSOLES.BANDAI_WONDERSWAN]: "55-wonderswan",
  [CONSOLES.BANDAI_WONDERSWAN_COLOR]: "56-wonderswan-color",
  [CONSOLES.GCE_VECTREX]: "125-gce-vectrex",
  [CONSOLES.MAGNAVOX_ODYSSEY_2]: "57-magnavox-odyssey-2",
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
  const result = {
    console: {
      name: "",
      slug: "",
      description: "",
    },
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
}

module.exports = {
  Scrape,
  meta: {
    hasCovers: true,
    name: "LaunchBox GamesDB Full Infos",
    author: "gr3",
  },
};
