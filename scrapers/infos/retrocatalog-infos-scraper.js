const { getConsoleNameFromSlug } = require("../../constants/console-mapping");
const { RetroCatalogsCovers } = require("../covers");

const Scrape = async (consoleSlug) => {
  var games = await RetroCatalogsCovers(consoleSlug, "info");
  return {
    console: {
      name: getConsoleNameFromSlug(consoleSlug),
      slug: consoleSlug,
      description: "",
    },
    games: games,
  };
};

module.exports = {
  Scrape,
   meta:{
    name: 'Retrocatalog Infos & covers',
    author: 'gr3'
  }
};
