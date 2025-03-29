const polishMonths = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

async function fetchLoniakHistory() {
    let response = await fetch('loniakiHistory.json');
    let jsonData = await response.json();
    return jsonData.history;
}

function calculateLoniakValue(daysSince, candlestickHeight, notesInCirculation) {
    let y = candlestickHeight < 0 ? notesInCirculation * -0.1 : 0.05
    return 1 + (daysSince * 0.05 - candlestickHeight + y) / 2
}

async function initializeApp() {
    var loniakHistory = await fetchLoniakHistory();

    let stockChartData = []
    let valueChartData = []
    let lastCandlestickHeight = 0;
    let currentDate = new Date(2025, 3, 26);
    let maxCandlestickHeight = 0;
    let minCandlestickHeight = 0;
    for (let i = 0; i < loniakHistory.length; i++) {
        let currentData = loniakHistory[i];
        let currentCandlestickHeight = lastCandlestickHeight + currentData.candlestickHeight
        if (currentCandlestickHeight > maxCandlestickHeight) {
            maxCandlestickHeight = currentCandlestickHeight
        }
        if (currentCandlestickHeight < minCandlestickHeight) {
            minCandlestickHeight = currentCandlestickHeight
        }
        let currentWrittenDate = currentDate.getDate() + " " + polishMonths[currentDate.getMonth()]
        let currentLoniakValue = calculateLoniakValue(i, currentData.candlestickHeight, currentData.notesInCirculation);
        if (i == loniakHistory.length - 1) {
            exchangeRate = currentLoniakValue
        }
        valueChartData.push({
            x: currentWrittenDate,
            y: currentLoniakValue.toFixed(2)
        })
        stockChartData.push({
            x: currentWrittenDate,
            y: [lastCandlestickHeight.toFixed(2), 1, 1, currentCandlestickHeight.toFixed(2)]
        })
        lastCandlestickHeight = currentCandlestickHeight;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    document.getElementById("exchange-rate").innerText = exchangeRate.toFixed(2)

    var valueChartOptions = {
        chart: {
            type: 'line'
        },
        series: [{
            data: valueChartData
        }]
    }

    let valueChart = new ApexCharts(document.getElementById("valueChart"), valueChartOptions);
    valueChart.render()

    var stockChartOptions = {
        chart: {
            type: 'candlestick'
        },
        series: [{
            data: stockChartData
        }],
        yaxis: {
            max: maxCandlestickHeight + 1,
            min: minCandlestickHeight - 1
        }
    }

    let stockChart = new ApexCharts(document.getElementById("stockChart"), stockChartOptions);
    stockChart.render()
}

var exchangeRate

initializeApp();

function convertToLoniak() {
    let pln = document.getElementById('plnInput').value;
    document.getElementById('loniakInput').value = (pln / exchangeRate).toFixed(2);
}

function convertToPLN() {
    let loniak = document.getElementById('loniakInput').value;
    document.getElementById('plnInput').value = (loniak * exchangeRate).toFixed(2);
}
