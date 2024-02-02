import Stock from './stock.mjs';


export default class StockManager {
    constructor() {
        this.stocks = [];
    }



    createNewStock(symbol, currency, exchange, price, marktvalue) {
        const stock = new Stock(symbol, currency, exchange, price, marktvalue);
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

    updateData(data) {
        const symbol = data.symbol;
        const price = data.price;
        const stock = this.getStock(symbol);
        if (stock) {
            stock.setPrice(price);
        }
    }
}
