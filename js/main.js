import { stockNameResults, getMatchingStockQuoteData, getMatchingStockDailyPrices, getMatchingStockOverviewData, closePricesChartingArr, data } from "./data.js"
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";

var homeView = document.querySelector('#homeContainer')
var chartingView = document.querySelector('#chartingContainer')
var quoteStatsView = document.querySelector('#quoteDataContainer')
var searchTerm = '';
var matchingStock;
var matchingStockTicker;

var searchButton = document.getElementById('search-button')

function handleSearch() {
 
    var stockNamesArr = stockNameResults;

    searchTerm = document.getElementById('site-search').value;
    
    for (var i in stockNamesArr) {
        if (stockNamesArr[i].name === searchTerm || stockNamesArr[i].ticker === searchTerm) {
            console.log('Matching Stock:', stockNamesArr[i].ticker + ' ' + stockNamesArr[i].name)
            matchingStock = {
                ticker: stockNamesArr[i].ticker,
                name: stockNamesArr[i].name,
                market: stockNamesArr[i].market,
                primary_exchange: stockNamesArr[i].primary_exchange,
                type: stockNamesArr[i].type,
                active: stockNamesArr[i].active,
                currency_name: stockNamesArr[i].currency_name,
                cik: stockNamesArr[i].cik,
                composite_figi: stockNamesArr[i].composite_figi,
                share_class_figi: stockNamesArr[i].share_class_figi,
                last_updated_utc: stockNamesArr[i].last_updated_utc
            }
            matchingStockTicker = matchingStock.ticker
        }
    }
    
    getMatchingStockQuoteData(matchingStockTicker)
    getMatchingStockDailyPrices(matchingStockTicker);
    getMatchingStockOverviewData(matchingStockTicker);
}

searchButton.addEventListener('click', handleSearch)

searchButton.addEventListener('click', changeViewSearchToOverview)

function changeViewSearchToOverview() {
    homeView.classList.remove('view')
    chartingView.classList.remove('hidden')
    homeView.classList.add('hidden')
    chartingView.classList.add('view')
    quoteStatsView.classList.remove('hidden')
    quoteStatsView.classList.add('view')
}

export { matchingStock }