document.addEventListener('DOMContentLoaded', () => {
    window.api.onStockUpdate((stocks) => {
        displayStocks(stocks);
    });
});


document.getElementById('add-stock-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    const symbol = event.target.querySelector('input[type="text"]').value;
    window.api.sendStockSymbol(symbol); // Send the symbol to the main process
});


let lastPrices = {}; // Object to store the last prices
function displayStocks(stocks) {
    const container = document.getElementById('stocks-container');
    container.className = 'flex flex-row flex-wrap justify-start items-start p-4 gap-4';

    container.innerHTML = '';

    stocks.forEach(stock => {
        let priceColor = 'black'; // Default color
        if (lastPrices[stock.symbol] !== undefined) {
            if(priceColor = stock.price > lastPrices[stock.symbol]){
                priceColor = 'green'; // Green if price is higher than last price
            }
            else if(priceColor = stock.price < lastPrices[stock.symbol]){
                priceColor = 'red'; // Red if price is lower than last price
            }
            else {
            priceColor = 'black'; // Black if price is the same as last price
            }
            lastPrices[stock.symbol] = stock.price; // Update last price for each stock within the loop
        }

        const stockElement = document.createElement('div');
        stockElement.classList.add('transform', 'hover:scale-105', 'transition', 'duration-300', 
        'bg-[#EDF7F6]', 'shadow-lg', 'hover:shadow-xl', 'rounded-2xl', 
        'overflow-hidden', 'p-4', 'text-[#2660A4]', 'w-60');
        stockElement.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${stock.symbol}</h3>
            <p class="text-lg font-semibold" style="color:${priceColor};">${stock.price} ${stock.currency}</p>
            <p class="text-sm">Exchange: ${stock.exchange}</p>
        `;
        container.appendChild(stockElement);
    });
}


