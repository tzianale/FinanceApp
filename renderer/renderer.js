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
            <p class="text-sm"> ${stock.exchange}</p>
            <button class="remove-btn absolute top-2 right-2 hover:bg-red-400 text-red-700 hover:text-white py-1 px-2 rounded hidden group-hover:block">Remove</button>
        `;
        container.appendChild(stockElement);

        stockElement.querySelector('.remove-btn').addEventListener('click', function() {
            window.api.removeStock(stock.symbol);
            container.removeChild(stockElement);



            
        });
        
    });
}


