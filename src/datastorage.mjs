import Stock from './stock.mjs';
import Store from 'electron-store';

export default class DataStorage {
    constructor() {
        this.stocks = [];
        this.stockdatastorage = new Store();
        this.loadData();
    }

    saveData() {
        // Serialize stocks to save
        const stockData = this.stocks.map(stock => ({
            symbol: stock.symbol,
            currency: stock.currency,
            price: stock.price,
        }));
        this.stockdatastorage.set('stocks', stockData);
    }

    loadData(symbolsArray = []) {
        const storedStocks = this.stockdatastorage.get('stocks') || [];
        this.stocks = storedStocks.filter(stock => symbolsArray.length === 0 || symbolsArray.includes(stock.symbol))
                                  .map(stock => new Stock(stock.symbol, stock.currency, stock.price));
    }


    createNewStock(symbol, price, currency) {
        // Ensure not to duplicate stocks
        if (!this.getStock(symbol)) {
            const stock = new Stock(symbol, currency, price);
            this.stocks.push(stock);
            this.saveData();
        }
    }

    removeStock(symbol) {
        this.stocks = this.stocks.filter(stock => stock.symbol !== symbol);
    }

    getStock(symbol) {
        return this.stocks.find(stock => stock.symbol === symbol);
    }

    getStocks() {
        return this.stocks;
    }

    getStockSymbols() {
        return this.stocks.map(stock => stock.symbol);
    }

    updateStock(symbol, newPrice, newCurrency) {
        const stock = this.getStock(symbol);
        if (stock) {
            stock.price = newPrice;
            stock.currency = newCurrency;
        }
    }
}
