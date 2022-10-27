import { stockNameResults, getMatchingStockDailyPrices, getMatchingStockOverviewData } from "./data.js"

var homeView = document.querySelector('#homeContainer')
var chartingView = document.querySelector('#chartingContainer')
var ratioStatsView = document.getElementById('ratioStatsContainer')
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
    
    homeView.classList.remove('view')
    chartingView.classList.remove('hidden')
    homeView.classList.add('hidden')
    chartingView.classList.add('view')
    ratioStatsView.classList.remove('hidden')
    ratioStatsView.classList.add('view')
    
    getMatchingStockDailyPrices(matchingStockTicker);
    getMatchingStockOverviewData(matchingStockTicker);
}

searchButton.addEventListener('click', handleSearch)

// function handleViewChange() {  
//     // homeView.setAttribute('data-view', 'hidden')
//     homeView.classList.remove('view')
//     chartingView.classList.remove('hidden')
//     homeView.classList.add('hidden')
//     chartingView.classList.add('view')
//     ratioStatsView.classList.remove('hidden')
//     ratioStatsView.classList.add('view')

// }

// var chart = document.querySelector('#dailyPriceChart')

// function displayDailyPriceChart() {
//     console.log(chartLabels)
//     console.log(closePrices)
//     window.myChart = new Chart(chart, {
//         type: 'line',
//         data: {
//           labels: chartLabels.slice(0, 5).reverse(),
//           datasets: [{
//             label: 'Close Price by Day',
//             data: closePrices.splice(0, 2),
//             backgroundColor: 'rgba(44, 130, 201, 1)',
//             borderColor: 'rgba(44, 130, 201, 1)',
//             borderWidth: 1
//           }]
//         },
//         options: {
//           maintainAspectRatio: false,
//           responsive: true,
//           reversed: true
//         }
//       })

//     //   window.myChart.appendChild(chart)
// }

export { matchingStock }