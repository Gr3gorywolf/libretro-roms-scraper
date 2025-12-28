const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");
const { normalizeString } = require('../../utils/utils');
const { CONSOLES } = require("../../constants/console-mapping");

const BASE_URL = "https://nswpedia.com/nintendo-switch-roms/page";
const START_PAGE = 1;
const END_PAGE = 115;

async function scrapePage(page) {
  const url = `${BASE_URL}/${page}`;
  console.log(`nswpedia: Scraping: ${url}`);

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const $ = cheerio.load(html);
  const games = [];

  $(".soft-item").each((_, el) => {
    const title = $(el)
      .find(".soft-item-title")
      .text()
      .trim();

    const sizeText = $(el)
      .find(".caption-1.version")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const image = $(el)
      .find("img.wp-post-image")
      .attr("src");

    if (!title || !image) return;

    games.push({
      normalizedTitle: normalizeString(title),
      title,
      size: sizeText,
      title_image:"",
      logo:"",
      portrait: image,
      gameplay_covers: [],
      console: "switch"
    });
  });

  return games;
}

async function Scrape(consoleSlug) {
  if (consoleSlug !== CONSOLES.NINTENDO_SWITCH) {
    console.error(`This scraper only supports the 'switch' console slug.`);
    return;
  }
  const allGames = [];

  for (let page = START_PAGE; page <= END_PAGE; page++) {
    const pageGames = await scrapePage(page);
    allGames.push(...pageGames);
  }
  console.log(`nswpedia-covers: ✔ ${allGames.length} games`);

  return allGames;

}

module.exports = {
  Scrape
};
