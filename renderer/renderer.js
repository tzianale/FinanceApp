/**
 * Sets up event listeners once the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Registers a callback to handle stock updates.
     * @param {Array} stocks - An array of updated stock data.
     */
    window.api.onStockUpdate((stocks) => {
        displayStocks(stocks);
    });
});

/**
 * Requests initial stock data from the main process as soon as the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    window.api.requestStockData();
});

/**
 * Adds an event listener to the form used for adding a stock symbol.
 * @param {Event} event - The event object representing the form submission event.
 */
document.getElementById('add-stock-form').addEventListener('submit', (event) => {
    event.preventDefault(); 
    const symbol = event.target.querySelector('input[type="text"]').value;
    window.api.sendStockSymbol(symbol);
});

/**
 * Displays stock information dynamically in the DOM.
 * @param {Array} stocks - An array of stock objects containing symbol, price, and currency.
 */
function displayStocks(stocks) {
    const container = document.getElementById('stocks-container');
    container.className = 'flex flex-row flex-wrap justify-start items-start p-4 gap-4';
    container.innerHTML = '';

    stocks.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.classList.add('transform', 'hover:scale-105', 'transition', 'duration-300', 
        'bg-[#EDF7F6]', 'shadow-lg', 'hover:shadow-xl', 'rounded-2xl', 
        'overflow-hidden', 'p-4', 'text-[#2660A4]', 'w-60', 'group');
        stockElement.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${stock.symbol}</h3>
            <p class="text-lg font-semibold text-black ">${stock.price} ${stock.currency}</p>
            <button class="remove-btn absolute top-2 right-2 hover:bg-red-400 text-red-700 hover:text-white py-1 px-2 rounded hidden group-hover:block">Remove</button>
        `;
        container.appendChild(stockElement);

        stockElement.querySelector('.remove-btn').addEventListener('click', function() {
            window.api.removeStock(stock.symbol);
            container.removeChild(stockElement);
        });
    });
}
