const { Scrape: LibretroScrapeCovers } = require('./libretro-scraper');
const { Scrape: NswpediaScrapeCovers } = require('./nswpedia-covers-scraper');
const { Scrape: RetroCatalogsCovers } = require('./retrocatalog-covers-scraper');
const { Scrape: PushSquareCovers } = require('./pushsquare-covers-scraper');
module.exports = {
    LibretroScrapeCovers,
    NswpediaScrapeCovers,
    RetroCatalogsCovers,
    PushSquareCovers
}