document.addEventListener('DOMContentLoaded', () => {
    window.api.getStocks().then((stocks) => {
        displayStocks(stocks);
    });
});



function displayStocks(stocks) {
    const container = document.getElementById('stocks-container');
    container.className = 'flex flex-row flex-wrap justify-start items-start p-4 gap-4'; // Added gap for consistent spacing

    container.innerHTML = ''; // Clear existing content

    stocks.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.classList.add(
            'transform', 'hover:scale-105', 'transition', 'duration-300', // Animation on hover
            'bg-[#EDF7F6]' , // Stylish gradient background
            'shadow-lg', 'hover:shadow-xl', // Enhanced shadow on hover
            'rounded-2xl', 'overflow-hidden', // Rounded corners and overflow handling
            'p-4', 'text-[#2660A4]', // Padding and text color
            'w-60' // Width of each card
        );
        stockElement.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${stock.symbol}</h3>
            <p class="text-lg font-semibold">Price: ${stock.price} ${stock.currency} </p>
            <p class="text-sm">Marktvalue: ${stock.marktvalue} ${stock.currency}</p>
            <p class="text-sm">Exchange: ${stock.exchange}</p>
        `; // Adjusted font sizes for better hierarchy

        container.appendChild(stockElement);
    });
}

