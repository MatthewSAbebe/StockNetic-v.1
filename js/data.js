var currentDate;
var stockNameResults;
var matchingStockResult;
var matchingStockQuoteDataResult;
var matchingStockResultProfile;
var closePrices = [];
var chartLabels = [];

//This is something you need to get better at, returning variables from custom functions. Those values are used in complex, multi-step calculations.
function getCurrentDate () {
    currentDate = new Date();
    return currentDate;
}

getCurrentDate()

/* Get stock names that match the search term*/
function getStockNames() {
    var xhrStockNameDataRequest = new XMLHttpRequest();
    xhrStockNameDataRequest.open('GET', `https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=10&apiKey=pbAveFNWpMw8DCRXcRLi4EFE2ukYHMNN`);
    xhrStockNameDataRequest.responseType = 'json';
    
    xhrStockNameDataRequest.addEventListener('load', function () {
        stockNameResults = xhrStockNameDataRequest.response['results']
    })
    xhrStockNameDataRequest.send()
}

getStockNames()

function getMatchingStockQuoteData(matchingStockTicker) {
  var xhrMatchingStockQuoteDataRequest = new XMLHttpRequest();
  xhrMatchingStockQuoteDataRequest.open('GET', `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${matchingStockTicker}&apikey=pbAveFNWpMw8DCRXcRLi4EFE2ukYHMNN`);
  xhrMatchingStockQuoteDataRequest.responseType = 'json';

  xhrMatchingStockQuoteDataRequest.addEventListener('load', function () {
    matchingStockQuoteDataResult = xhrMatchingStockQuoteDataRequest.response
    console.log(matchingStockQuoteDataResult)
  })
  xhrMatchingStockQuoteDataRequest.send()

  return matchingStockQuoteDataResult;
}

function getMatchingStockDailyPrices(matchingStock) {
    var xhrMatchingStockDailyPricesDataRequest = new XMLHttpRequest();
    xhrMatchingStockDailyPricesDataRequest.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${matchingStock}&apikey=EBZ2O8GQQ9CA3ECX`)
    xhrMatchingStockDailyPricesDataRequest.responseType = 'json';
    xhrMatchingStockDailyPricesDataRequest.addEventListener('load', function () {
        matchingStockResult = xhrMatchingStockDailyPricesDataRequest.response['Time Series (Daily)'];
        var matchingStockWeeklyPriceData = [];
        matchingStockWeeklyPriceData.push(matchingStockResult)
        var stockData = matchingStockWeeklyPriceData[0];
        for (var key in stockData) {
          closePrices.push(stockData[key]['4. close']);
          chartLabels.push(key);
        }

        var chart = document.querySelector('#dailyPriceChart')
            // eslint-disable-next-line no-undef
            window.myChart = new Chart(chart, {
                type: 'line',
                data: {
                  labels: chartLabels.slice(0, 5).reverse(),
                  datasets: [{
                    label: 'Close Price by Day',
                    data: closePrices.splice(0, 5),
                    backgroundColor: 'rgba(44, 130, 201, 1)',
                    borderColor: 'rgba(44, 130, 201, 1)',
                    borderWidth: 1
                  }]
                },
                options: {
                  maintainAspectRatio: false,
                  responsive: true,
                  reversed: true
                }
              })
    })
    xhrMatchingStockDailyPricesDataRequest.send()
}

function getMatchingStockOverviewData(matchingStock) {
    var xhrMatchingStockOverviewDataRequest = new XMLHttpRequest();
    xhrMatchingStockOverviewDataRequest = new XMLHttpRequest();
    xhrMatchingStockOverviewDataRequest.open('GET', `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${matchingStock}&apikey=EBZ2O8GQQ9CA3ECX`)
    xhrMatchingStockOverviewDataRequest.responseType = 'json';
    
    xhrMatchingStockOverviewDataRequest.addEventListener('load', function () {
        matchingStockResultProfile = xhrMatchingStockOverviewDataRequest.response;
        console.log(matchingStockResultProfile)
    })
    xhrMatchingStockOverviewDataRequest.send()
}

export { currentDate, stockNameResults, getMatchingStockQuoteData, getMatchingStockDailyPrices, getMatchingStockOverviewData }

