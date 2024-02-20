export default class Stock {
    symbol;
    currency;
    exchange;
    price;

    constructor(symbol, currency, price) {
        this.symbol = symbol;
        this.currency = currency;
        this.price = price;
    }

    getSymbol() {
        return this.symbol;
    }

    getCurrency() {
        return this.currency;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }

}