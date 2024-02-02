document.addEventListener('DOMContentLoaded', () => {
    window.api.onStockUpdate((stocks) => {
        displayStocks(stocks);
    });
});

let lastPrices = {}; // Object to store the last prices


function displayStocks(stocks) {
    const container = document.getElementById('stocks-container');
    container.className = 'flex flex-row flex-wrap justify-start items-start p-4 gap-4';

    container.innerHTML = '';

    stocks.forEach(stock => {
        let priceColor = 'black'; // Default color
        if (lastPrices[stock.symbol] !== undefined) {
            priceColor = stock.price > lastPrices[stock.symbol] ? 'green' : 'red';
        }
        lastPrices[stock.symbol] = stock.price; // Update last price for each stock within the loop

        const stockElement = document.createElement('div');
        stockElement.classList.add('transform', 'hover:scale-105', 'transition', 'duration-300', 
        'bg-[#EDF7F6]', 'shadow-lg', 'hover:shadow-xl', 'rounded-2xl', 
        'overflow-hidden', 'p-4', 'text-[#2660A4]', 'w-60');
        stockElement.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${stock.symbol}</h3>
            <p class="text-lg font-semibold" style="color:${priceColor};">${stock.price} ${stock.currency}</p>
            <p class="text-sm">Marktvalue: ${stock.marktvalue} ${stock.currency}</p>
            <p class="text-sm">Exchange: ${stock.exchange}</p>
        `;
        container.appendChild(stockElement);
    });
}


