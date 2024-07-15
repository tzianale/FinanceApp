/**
 * Represents a single stock in the financial market.
 */
export default class Stock {
    /**
     * Symbol of the stock, usually an abbreviation used on a stock exchange.
     * @type {string}
     */
    symbol;

    /**
     * Currency in which the stock price is denominated.
     * @type {string}
     */
    currency;

    /**
     * Current price of the stock.
     * @type {number}
     */
    price;

    /**
     * Constructs a new Stock instance.
     * @param {string} symbol - The stock symbol.
     * @param {string} currency - The currency of the stock price.
     * @param {number} price - The current price of the stock.
     */
    constructor(symbol, currency, price) {
        this.symbol = symbol;
        this.currency = currency;
        this.price = price;
    }

    /**
     * Retrieves the stock's symbol.
     * @returns {string} The stock symbol.
     */
    getSymbol() {
        return this.symbol;
    }

    /**
     * Retrieves the currency of the stock's price.
     * @returns {string} The currency of the stock price.
     */
    getCurrency() {
        return this.currency;
    }

    /**
     * Retrieves the current price of the stock.
     * @returns {number} The current stock price.
     */
    getPrice() {
        return this.price;
    }

    /**
     * Sets a new price for the stock.
     * @param {number} price - The new price of the stock.
     */
    setPrice(price) {
        this.price = price;
    }
}
