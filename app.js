const ctx = document.getElementById('loniakChart').getContext('2d');
const loniakData = {
    labels: ['Marzec 21', 'Marzec 22', 'Marzec 23', 'Marzec 24', 'Marzec 25'], // Dates
    datasets: [{
        label: 'Łoniaki na PLN',
        data: [1, 1.1, 1.3, 1.2, 1.5], // Example exchange rate values
        borderColor: '#FF5733',
        borderWidth: 5
    }]
};

new Chart(ctx, {
    type: 'line',
    data: loniakData,
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: false }
        }
    }
});

let exchangeRate = 1.23;

function convertToLoniak() {
    let pln = document.getElementById('plnInput').value;
    document.getElementById('loniakInput').value = (pln / exchangeRate).toFixed(2);
}

function convertToPLN() {
    let loniak = document.getElementById('loniakInput').value;
    document.getElementById('plnInput').value = (loniak * exchangeRate).toFixed(2);
}
