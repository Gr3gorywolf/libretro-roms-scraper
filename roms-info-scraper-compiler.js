const axios = require("axios");
const cheerio = require("cheerio");
const { normalizeDate, normalizeString, wordSimilarity } = require("./utils");
const fs = require("fs-extra");
const path = require("path");
const WIKI_BASE = "https://en.wikipedia.org";

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

/**
 * Scrapea Wikipedia y devuelve:
 * { [slug]: fullWikipediaUrl }
 */
async function getConsoleGameListUrls() {
  return {
    amiga: ["./databases/amiga.json"],
    c64: ["./databases/c64.json"],
    dreamcast: ["https://en.wikipedia.org/wiki/List_of_Dreamcast_games"],
    gb: ["https://en.wikipedia.org/wiki/List_of_Game_Boy_games"],
    gba: ["https://en.wikipedia.org/wiki/List_of_Game_Boy_Advance_games"],
    gbc: ["https://en.wikipedia.org/wiki/List_of_Game_Boy_Color_games"],
    gamegear: ["https://en.wikipedia.org/wiki/List_of_Game_Gear_games"],
    gc: ["https://en.wikipedia.org/wiki/List_of_GameCube_games"],
    neogeo: ["https://en.wikipedia.org/wiki/List_of_Neo_Geo_games"],
    ngp: ["https://en.wikipedia.org/wiki/List_of_Neo_Geo_Pocket_games"],
    n64: ["https://en.wikipedia.org/wiki/List_of_Nintendo_64_games"],
    nds: ["https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games", "https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games_(0%E2%80%93C)", "https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games_(D%E2%80%93I)", "https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games_(J%E2%80%93P)", "https://en.wikipedia.org/wiki/List_of_Nintendo_DS_games_(Q%E2%80%93Z)"],
    nes: ["https://en.wikipedia.org/wiki/List_of_Nintendo_Entertainment_System_games"],
    switch: [
      "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(0%E2%80%939)",
      "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(A%E2%80%93Am)",
      "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(An%E2%80%93Az)",
      "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(B)",
      "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(C%E2%80%93G)",
      "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(H%E2%80%93P)",
      "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games_(Q%E2%80%93Z)",
      "https://en.wikipedia.org/wiki/List_of_Nintendo_Switch_games",
    ],
    ps2: ["https://en.wikipedia.org/wiki/List_of_PlayStation_2_games_(A%E2%80%93K)", "https://en.wikipedia.org/wiki/List_of_PlayStation_2_games_(L%E2%80%93Z)"],
    ps3: ["https://en.wikipedia.org/wiki/List_of_PlayStation_3_games_(A%E2%80%93C)", "https://en.wikipedia.org/wiki/List_of_PlayStation_3_games_(D%E2%80%93I)", "https://en.wikipedia.org/wiki/List_of_PlayStation_3_games_(J%E2%80%93P)", "https://en.wikipedia.org/wiki/List_of_PlayStation_3_games_(Q%E2%80%93Z)"],
    psp: ["https://en.wikipedia.org/wiki/List_of_PlayStation_Portable_games"],
    sega32x: ["https://en.wikipedia.org/wiki/List_of_32X_games"],
    genesis: ["https://en.wikipedia.org/wiki/List_of_Sega_Genesis_games"],
    saturn: ["https://en.wikipedia.org/wiki/List_of_Sega_Saturn_games"],
    snes: ["https://en.wikipedia.org/wiki/List_of_Super_Nintendo_Entertainment_System_games"],
    vectrex: ["https://en.wikipedia.org/wiki/List_of_Vectrex_games"],
    odyssey2: ["https://en.wikipedia.org/wiki/List_of_Magnavox_Odyssey_2_games"],
    vb: ["https://en.wikipedia.org/wiki/List_of_Virtual_Boy_games"],
    wii: ["https://en.wikipedia.org/wiki/List_of_Wii_games"],
    wiiu: ["https://en.wikipedia.org/wiki/List_of_Wii_U_games"],
    wonderswan: ["https://en.wikipedia.org/wiki/List_of_WonderSwan_games"],
    wonderswancolor: ["https://en.wikipedia.org/wiki/List_of_WonderSwan_Color_games"],
  };
}

async function scrapeConsoleGames({ url, slug }) {
  if (url.includes("./databases/")) {
    const data = await fs.readJson(url);
    return {
      console: {
        name: data.data.name,
        slug,
        description: data.data.description,
      },
      games: [...data.games].map((game) => ({
        slug: normalizeString(game.title),
        name: game.title,
        developer: "",
        publisher: "",
        releaseDate: `01-01-${game.release_year}`,
        detailsUrl: game.url,
        console: slug,
      })),
    };
  }

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });
  const $ = cheerio.load(data);

  // Nombre de la consola
  const consoleName = $("#firstHeading").text().trim();

  // Descripción
  const description = extractDescription($);

  const result = {
    console: {
      name: consoleName,
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
      slug: normalizeString(name),
      name,
      developer: currentDeveloper,
      publisher: currentPublisher,
      releaseDate,
      detailsUrl,
      console: slug,
    });
  });

  return result;
}

async function run() {
  const consoleUrls = await getConsoleGameListUrls();
  const allData = {};
  console.log("Found console URLs:", consoleUrls);
  await fs.ensureDir(path.join("output", "roms-infos"));
  for (const slug of Object.keys(consoleUrls)) {
    const urls = consoleUrls[slug];
    allData[slug] = {
      console: null,
      games: [],
    };
    for (const url of urls) {
      console.log(`Scraping ${slug} from ${url}...`);
      const data = await scrapeConsoleGames({ url, slug });
      if (!allData[slug].console) {
        allData[slug].console = data.console;
      }
      allData[slug].games.push(...data.games);
    }
    try {
      const romCovers = await fs.readJson(path.join("output", "covers", `${slug}.json`));
      console.log(`Found ${allData[slug].games.length} games for ${slug}.`);
      console.log(`Matching covers for ${slug}... Found ${romCovers.length} covers.`);
      let matchedCovers = 0;
      allData[slug].games = allData[slug].games
        .map((game) => {
          const normalizedTitle = normalizeString(game.name);
          const foundCover = findBestCover(romCovers, normalizedTitle, 0.7);
          if (foundCover) {
            matchedCovers++;
            return {
              ...game,
              portrait: foundCover.portrait ?? foundCover.title_image,
              logo: foundCover.logo,
              title_image: foundCover.title_image,
            };
          }
          return game;
        })
        .filter((game) => game.portrait || game.detailsUrl);
      console.log(`Matching covers for ${slug}... Matched ${matchedCovers} covers out of ${allData[slug].games.length} games.`);
      await fs.writeJson(path.join("output", "roms-infos", `${slug}.json`), allData[slug]);
    } catch (err) {
      console.error(`Error processing covers for ${slug} skipping:`, err);
    }
  }
}

run();
