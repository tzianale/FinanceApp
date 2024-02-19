import Stock from './stock.mjs';
import Store from 'electron-store';

export default class DataStorage {
    constructor() {
        this.stocks = [];
        this.stockdatastorage = new Store();
        this.loadData(); // Ensure this is called with appropriate arguments or adjusted to handle being called without arguments.
    }

    saveData() {
        const stockData = this.stocks.map(stock => ({
            symbol: stock.symbol,
            currency: stock.currency,
            exchange: stock.exchange,
            price: stock.price,
        }));
        this.stockdatastorage.set('stocks', stockData);
    }

    loadData(symbolsArray = []) { // Default symbolsArray to an empty array if undefined
        const storedStocks = this.stockdatastorage.get('stocks');
        if (storedStocks) {
            storedStocks.forEach(stock => {
                // Directly check this.stocks instead of this.dataStorage.getStock
                if (symbolsArray.includes(stock.symbol) && !this.getStock(stock.symbol)){
                    this.createNewStock(stock.symbol, stock.currency, stock.exchange, stock.price);
                }
            });
        } else {
            console.log('No stored stock data found, initializing with default or fetching new data...');
        }
    }

    createNewStock(symbol, currency, exchange, price) {
        const stock = new Stock(symbol, currency, exchange, price);
        this.stocks.push(stock);
    }

    removeStock(symbol) {
        this.stocks = this.stocks.filter(stock => stock.symbol !== symbol);
    }

    getStock(symbol) {
        return this.stocks.find(stock => stock.symbol === symbol);
    }

    updateStock(symbol, newPrice, newCurrency, newExchange) {
        const stock = this.getStock(symbol);
        if (stock) {
            stock.price = newPrice; // Assuming Stock class has these properties directly accessible
            stock.currency = newCurrency;
            stock.exchange = newExchange;
        }
    }
}
