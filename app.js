const polishMonths = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

async function fetchLoniakHistory() {
    let response = await fetch('loniakiHistory.json');
    let jsonData = await response.json();
    console.log(jsonData);
    return jsonData.history;
}

function calculateLoniakValue(daysSince, candlestickHeight, notesInCirculation) {
    let y = candlestickHeight < 0 ? notesInCirculation * 0.1 : 0.05
    return 1 + (daysSince * 0.05 - candlestickHeight + y) / 2
}

async function initializeApp() {
    var loniakHistory = await fetchLoniakHistory();
    let stockChartData = []
    let valueChartData = []
    let lastCandlestickHeight = 0;
    let currentDate = new Date(2025, 3, 26);
    for (let i = 0; i < loniakHistory.length; i++) {
        let currentData = loniakHistory[i];
        let currentWrittenDate = currentDate.getDate() + " " + polishMonths[currentDate.getMonth()]
        let currentLoniakValue = calculateLoniakValue(i, currentData.candlestickHeight, currentData.notesInCirculation);
        valueChartData.push({
            x: currentWrittenDate,
            y: currentLoniakValue
        })
        stockChartData.push({
            x: currentWrittenDate,
            y: [lastCandlestickHeight, 0, 0, currentData.candlestickHeight]
        })
        currentDate.setDate(currentDate.getDate() + 1);
    }

    var valueChartOptions = {
        chart: {
            type: 'line'
        },
        series: [{
            data: valueChartData
          }], 
          xaxis: {
            type: 'datetime'
          }  
    }

    let valueChart = new ApexCharts(document.getElementById("valueChart"), valueChartOptions);
    valueChart.render()

    var stockChartOptions = {
        chart: {
            type: 'candlestick'
        },
        series: [{
            data: stockChartData
        }]
    }

    let stockChart = new ApexCharts(document.getElementById("stockChart"), stockChartOptions);
    stockChart.render()
}

initializeApp();

let exchangeRate = 1.23;

function convertToLoniak() {
    let pln = document.getElementById('plnInput').value;
    document.getElementById('loniakInput').value = (pln / exchangeRate).toFixed(2);
}

function convertToPLN() {
    let loniak = document.getElementById('loniakInput').value;
    document.getElementById('plnInput').value = (loniak * exchangeRate).toFixed(2);
}
