const { Scrape: LocalScrapeInfos} = require('./local-infos-scraper');
const { Scrape: WikipediaScrapeInfos } = require('./wikipedia-infos-scraper');
module.exports = {
    LocalScrapeInfos,
    WikipediaScrapeInfos
}