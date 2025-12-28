const { CONSOLES, CONSOLE_MAPPING } = require("../../constants/console-mapping");
const { normalizeDate, normalizeString } = require("../../utils/utils");
const axios = require("axios");
const cheerio = require("cheerio");
const { CONSOLE_LOGOS } = require("../../constants/console-logos");
const WIKI_BASE = "https://en.wikipedia.org";
const urlMappings = {
  [CONSOLES.SEGA_DREAMCAST]: ["https://en.wikipedia.org/wiki/List_of_Dreamcast_games"],
  [CONSOLES.NINTENDO_GAME_BOY]: ["https://en.wikipedia.org/wiki/List_of_Game_Boy_games"],
  [CONSOLES.NINTENDO_GAME_BOY_ADVANCE]: ["https://en.wikipedia.org/wiki/List_of_Game_Boy_Advance_games"],
  [CONSOLES.NINTENDO_GAME_BOY_COLOR]: ["https://en.wikipedia.org/wiki/List_of_Game_Boy_Color_games"],
  [CONSOLES.SEGA_GAME_GEAR]: ["https://en.wikipedia.org/wiki/List_of_Game_Gear_games"],
  [CONSOLES.NINTENDO_GAMECUBE]: ["https://en.wikipedia.org/wiki/List_of_GameCube_games"],
  [CONSOLES.NEO_GEO]: ["https://en.wikipedia.org/wiki/List_of_Neo_Geo_games"],
  [CONSOLES.NINTENDO_64]: ["https://en.wikipedia.org/wiki/List_of_Nintendo_64_games"],
  [CONSOLES.NINTENDO_DS]: ["https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games", "https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games_(0%E2%80%93C)", "https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games_(D%E2%80%93I)", "https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games_(J%E2%80%93P)", "https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games_(Q%E2%80%93Z)"],
  [CONSOLES.NINTENDO_NES]: ["https://en.wikipedia.org/wiki/List_of_Nintendo_Entertainment_System_games"],
  [CONSOLES.NINTENDO_SWITCH]: [
    "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(0%E2%80%939)",
    "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(A%E2%80%93Am)",
    "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(An%E2%80%93Az)",
    "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(B)",
    "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(C%E2%80%93G)",
    "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(H%E2%80%93P)",
    "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(Q%E2%80%93Z)",
    "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games",
  ],
  [CONSOLES.SONY_PLAYSTATION]: ["https://en.wikipedia.org/wiki/List_of_PlayStation_(console)_games_(A%E2%80%93L)", "https://en.wikipedia.org/wiki/List_of_PlayStation_(console)_games_(M%E2%80%93Z)#Games_list_(M%E2%80%93Z)"],
  [CONSOLES.NINTENDO_3DS]: ["https://en.wikipedia.org/wiki/List_of_Nintendo_3DS_games_(0%E2%80%93M)", "https://en.wikipedia.org/wiki/List_of_Nintendo_3DS_games_(N%E2%80%93Z)"],
  [CONSOLES.SONY_PLAYSTATION_VITA]: [
    "https://en.wikipedia.org/wiki/List_of_PlayStation_Vita_games_(A%E2%80%93D)",
    "https://en.wikipedia.org/wiki/List_of_PlayStation_Vita_games_(E%E2%80%93H)",
    "https://en.wikipedia.org/wiki/List_of_PlayStation_Vita_games_(I%E2%80%93L)",
    "https://en.wikipedia.org/wiki/List_of_PlayStation_Vita_games_(M%E2%80%93O)",
    "https://en.wikipedia.org/wiki/List_of_PlayStation_Vita_games_(P%E2%80%93R)",
    "https://en.wikipedia.org/wiki/List_of_PlayStation_Vita_games_(S)",
    "https://en.wikipedia.org/wiki/List_of_PlayStation_Vita_games_(T%E2%80%93V)",
    "https://en.wikipedia.org/wiki/List_of_PlayStation_Vita_games_(W%E2%80%93Z)",
  ],
  [CONSOLES.SONY_PLAYSTATION_2]: ["https://en.wikipedia.org/wiki/List_of_PlayStation_2_games_(A%E2%80%93K)", "https://en.wikipedia.org/wiki/List_of_PlayStation_2_games_(L%E2%80%93Z)"],
  [CONSOLES.SONY_PLAYSTATION_3]: ["https://en.wikipedia.org/wiki/List_of_PlayStation_3_games_(A%E2%80%93C)", "https://en.wikipedia.org/wiki/List_of_PlayStation_3_games_(D%E2%80%93I)", "https://en.wikipedia.org/wiki/List_of_PlayStation_3_games_(J%E2%80%93P)", "https://en.wikipedia.org/wiki/List_of_PlayStation_3_games_(Q%E2%80%93Z)"],
  [CONSOLES.SONY_PSP]: ["https://en.wikipedia.org/wiki/List_of_PlayStation_Portable_games"],
  [CONSOLES.SEGA_32X]: ["https://en.wikipedia.org/wiki/List_of_32X_games"],
  [CONSOLES.SEGA_GENESIS]: ["https://en.wikipedia.org/wiki/List_of_Sega_Genesis_games"],
  [CONSOLES.SEGA_SATURN]: ["https://en.wikipedia.org/wiki/List_of_Sega_Saturn_games"],
  [CONSOLES.NINTENDO_SNES]: ["https://en.wikipedia.org/wiki/List_of_Super_Nintendo_Entertainment_System_games"],
  [CONSOLES.GCE_VECTREX]: ["https://en.wikipedia.org/wiki/List_of_Vectrex_games"],
  [CONSOLES.MAGNAVOX_ODYSSEY_2]: ["https://en.wikipedia.org/wiki/List_of_Magnavox_Odyssey_2_games"],
  [CONSOLES.NINTENDO_VIRTUAL_BOY]: ["https://en.wikipedia.org/wiki/List_of_Virtual_Boy_games"],
  [CONSOLES.NINTENDO_WII]: ["https://en.wikipedia.org/wiki/List_of_Wii_games"],
  [CONSOLES.NINTENDO_WII_U]: ["https://en.wikipedia.org/wiki/List_of_Wii_U_games"],
  [CONSOLES.BANDAI_WONDERSWAN]: ["https://en.wikipedia.org/wiki/List_of_WonderSwan_games"],
  [CONSOLES.BANDAI_WONDERSWAN_COLOR]: ["https://en.wikipedia.org/wiki/List_of_WonderSwan_Color_games"],
};

function extractDescription($) {
  let description = "";

  $("#mw-content-text > div.mw-parser-output > p").each((_, p) => {
    const text = $(p).text().trim();
    if (text.length > 50) {
      description = text;
      return false;
    }
  });

  return description;
}

const scrapeWikipediaPage = async (slug, url) => {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });
  const $ = cheerio.load(data);

  const consoleName = Object.entries(CONSOLE_MAPPING).find(([, value]) => value === slug)?.[0] || slug;
  const description = extractDescription($);
  const result = {
    console: {
      name: consoleName,
      logoUrl: CONSOLE_LOGOS[slug],
      slug,
      description,
    },
    games: [],
  };

  let table = $("#softwarelist").first();
  if (!table.length) {
    table = $("table#list").first();
    if (!table.length) {
      table = $("table.wikitable.sortable").first();
      if (!table.length) {
        return result;
      }
    }
  }

  let currentDeveloper = "";
  let currentPublisher = "";

  table.find("tbody > tr").each((_, row) => {
    const $row = $(row);

    let nameCell = $row.find("th");
    if (!nameCell.length) {
      nameCell = $row.find("td").first();
      if (!nameCell.length) {
        return;
      }
    }

    const name = nameCell.find("i a").text().trim() || nameCell.find("i span").first().text().trim() || nameCell.find("i").first().text().trim() || nameCell.find("a").first().text().trim();

    let detailsUrl = nameCell.find("a").attr("href");
    if (detailsUrl) detailsUrl = `${WIKI_BASE}${detailsUrl}`;

    const tds = $row.find("td");

    let tdIndex = 0;

    if (tds.eq(tdIndex).attr("rowspan") || tds.length >= 3) {
      const devText = tds.eq(tdIndex).text().trim();
      if (devText) currentDeveloper = devText;
      tdIndex++;
    }

    if (tds.eq(tdIndex).attr("rowspan") || tds.length >= 3) {
      const pubText = tds.eq(tdIndex).text().trim();
      if (pubText) currentPublisher = pubText;
      tdIndex++;
    }

    const rawDate = tds.eq(tdIndex)?.text()?.trim() || "";
    const releaseDate = normalizeDate(rawDate);

    result.games.push({
      slug: `${slug}-${normalizeString(name)}`,
      name,
      developer: currentDeveloper,
      publisher: currentPublisher,
      releaseDate,
      detailsUrl,
      console: slug,
    });
  });

  return result;
};

const Scrape = async (consoleSlug) => {
  var urls = urlMappings[consoleSlug];
  if (!urls) {
    console.warn(`wikipedia-infos: No Wikipedia URL mapping found for console slug: ${consoleSlug}`);
    return null;
  }
  var resultData = {};
  for (let url of urls) {
    var pageData = await scrapeWikipediaPage(consoleSlug, url);
    resultData = {
      console: pageData.console,
      games: [...(resultData.games || []), ...pageData.games],
    };
  }
  console.log(`wikipedia-infos: ✔ ${resultData.games.length} games for console slug: ${consoleSlug}`);
  return resultData;
};

module.exports = {
  Scrape,
  meta: {
    name: "Wikipedia Infos",
    author: "gr3",
  },
};
