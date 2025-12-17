const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

const BASE_URL = "https://nswpedia.com/nintendo-switch-roms/page";
const START_PAGE = 1;
const END_PAGE = 115;

const OUTPUT_PATH = path.join("output", "covers", "switch.json");
const { normalizeString } = require('./utils')

async function scrapePage(page) {
  const url = `${BASE_URL}/${page}`;
  console.log(`Scraping: ${url}`);

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

async function run() {
  const allGames = [];

  for (let page = START_PAGE; page <= END_PAGE; page++) {
    const pageGames = await scrapePage(page);
    allGames.push(...pageGames);
  }

  await fs.ensureDir(path.dirname(OUTPUT_PATH));
  await fs.writeJson(OUTPUT_PATH, allGames, { spaces: 2 });

  console.log(`✅ Saved ${allGames.length} games to ${OUTPUT_PATH}`);
}

run().catch(console.error);
