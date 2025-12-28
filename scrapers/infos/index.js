const { Scrape: LocalScrapeInfos} = require('./local-infos-scraper');
const { Scrape: WikipediaScrapeInfos } = require('./wikipedia-infos-scraper');
const { Scrape:  RetroCatalogsInfos } = require('./retrocatalog-infos-scraper');
module.exports = {
    LocalScrapeInfos,
    WikipediaScrapeInfos,
    RetroCatalogsInfos
}