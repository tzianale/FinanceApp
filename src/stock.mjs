export default class Stock {
    symbol;
    currency;
    exchange;
    price;

    constructor(symbol, currency, exchange, price) {
        this.symbol = symbol;
        this.currency = currency;
        this.exchange = exchange;
        this.price = price;
    }

    getSymbol() {
        return this.symbol;
    }

    getCurrency() {
        return this.currency;
    }

    getExchange() {
        return this.exchange;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }

}