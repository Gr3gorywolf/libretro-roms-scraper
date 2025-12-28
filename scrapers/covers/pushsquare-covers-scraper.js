const axios = require("axios");
const cheerio = require("cheerio");
const { normalizeString } = require("../../utils/utils");
const { CONSOLES } = require("../../constants/console-mapping");

const pagesPerConsole = {
  [CONSOLES.SONY_PLAYSTATION_VITA]: 10,
  [CONSOLES.SONY_PLAYSTATION_3]: 31,
};

const CONSOLE_MAPPING = {
  [CONSOLES.SONY_PLAYSTATION_VITA]: "psvita",
  [CONSOLES.SONY_PLAYSTATION_3]: "ps3",
};

async function scrapePage(consoleId,consoleSlug,  page = 1) {
  const URL = `https://www.pushsquare.com/${consoleId}/games/browse?page=${page}`;
  const { data: html } = await axios.get(URL);
  const $ = cheerio.load(html);

  const results = [];

  $("li.item.item-game").each((_, el) => {
    const element = $(el);

    const title = element.find("a.title.accent-hover span").first().text().trim(); 
    const img = element.find(".cover img").attr("src") || "";

    const item = {
      titleNormalized: normalizeString(title),
      title: title,
      size: "",
      logo: "",
      title_image: "",
      portrait: img,
      gameplay_covers: [],
      console: consoleSlug,
    };

    results.push(item);
  });

  return results;
}

async function Scrape(consoleSlug) {
  let allResults = [];
  var consoleId = CONSOLE_MAPPING[consoleSlug];
  if (!consoleId) {
    console.error(`pushsquare: ✘ Console slug '${consoleSlug}' not supported.`);
    return [];
  }
  var totalPages = pagesPerConsole[consoleSlug] || 5;
  for (let page = 1; page <= totalPages; page++) {
    console.log(`pushsquare: Scraping page ${page} for console '${consoleSlug}'...`);
    const pageResults = await scrapePage(consoleId,consoleSlug, page);
    allResults = allResults.concat(pageResults);
  }
  console.log(allResults);
  return allResults;
}

module.exports = {
  Scrape,
  meta:{
    name: 'Pushsquare Covers',
    author: 'gr3'
  }
};
