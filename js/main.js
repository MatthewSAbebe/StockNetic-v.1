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

// function displayLineChart() {
//   console.log(data)
//   console.log(closePricesChartingArr)
//   // var data = []
//     var root = am5.Root.new("dailyPriceChart");

//     // root.setThemes([
//     //   am5themes_Animated.new(root)
//     // ]);

//     var stockChart = root.container.children.push(
//     am5stock.StockChart.new(root, {})
//     );
    
//     var mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
//       wheelY: "zoomX",
//       panX: true,
//       panY: true
//     }));

//       var valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
//         renderer: am5xy.AxisRendererY.new(root, {})
//       }));
      
//       var dateAxis = mainPanel.xAxes.push(am5xy.DateAxis.new(root, {
//         baseInterval: {
//           timeUnit: "day",
//           count: 1
//         },
//         renderer: am5xy.AxisRendererX.new(root, {})
//       }));

//       var valueSeries = mainPanel.series.push(am5xy.LineSeries.new(root, {
//           name: "STCK",
//           valueXField: "date",
//           valueYField: "price",
//           xAxis: dateAxis,
//           yAxis: valueAxis,
//           legendValueText: "{valueY}"
//         })
//       );
      
//       valueSeries.data.setAll(data);

//       stockChart.set("stockSeries", valueSeries);

//       var valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
//         stockChart: stockChart
//       }));
//       valueLegend.data.setAll([valueSeries]);
// }

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