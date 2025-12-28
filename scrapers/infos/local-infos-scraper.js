const { CONSOLES } = require("../../constants/console-mapping");
const {normalizeString } = require("../../utils/utils");
const fs = require('fs-extra');
const urlMappings = {
  [CONSOLES.COMMODORE_AMIGA]: ["./databases/amiga.json"],
  [CONSOLES.COMMODORE_64]: ["./databases/c64.json"],
  [CONSOLES.SNK_NEO_GEO_POCKET]: ["./databases/ngp.json"],
  [CONSOLES.SNK_NEO_GEO_POCKET_COLOR]: ["./databases/ngpc.json"],
};

const Scrape = async (slug) => {
  if(!urlMappings[slug]) {
    console.warn(`local-infos: No local infos mapping found for console slug: ${slug}`);
    return null;
  }
  const data = await fs.readJson(urlMappings[slug][0]);
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
};

module.exports = {
  Scrape,
   meta:{
    name: 'Local Infos Scraper',
    author: 'gr3'
  }
}
