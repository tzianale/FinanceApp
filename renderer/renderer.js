document.addEventListener('DOMContentLoaded', () => {
    const stockNameElement = document.getElementById('stock-name'); // Ensure ID matches your HTML

    window.api.getStockName().then((name) => {
        stockNameElement.textContent = name; // Update DOM element with the stock name
    });
});
