import Stock from './stock.mjs';

export default class DataStorage {
    stocks = [];

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
    

    updatePrice(symbol, newPrice) {
        const stock = this.getStock(symbol);
        if (stock) {
            stock.setPrice(newPrice);
        }
    }
}