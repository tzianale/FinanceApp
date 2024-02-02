export default class Stock {
    symbol;
    currency;
    exchange;
    price;
    marktvalue;

    constructor(symbol, currency, exchange, price, marktvalue) {
        this.symbol = symbol;
        this.currency = currency;
        this.exchange = exchange;
        this.price = price;
        this.marktvalue = marktvalue
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