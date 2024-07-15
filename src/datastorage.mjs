import Stock from "./stock.mjs";
import Store from "electron-store";

/**
 * Class to handle data storage and retrieval of stock information.
 * Utilizes electron-store for local storage to persist stock data.
 */
export default class DataStorage {
  /**
   * Creates an instance of DataStorage.
   */
  constructor() {
    this.stocks = [];
    this.stockdatastorage = new Store();
    this.loadData();
  }

  /**
   * Saves the current state of stocks to local storage.
   * Filters out stocks with undefined or 'loading' prices before merging and storing.
   */
  saveData() {
    const storedStocks = this.stockdatastorage.get("stocks") || [];
    const filteredStoredStocks = storedStocks.filter(
      (stock) => stock.price && stock.price !== "loading"
    );

    const mergedStocks = [...this.stocks];
    filteredStoredStocks.forEach((storedStock) => {
      if (!mergedStocks.some((stock) => stock.symbol === storedStock.symbol)) {
        mergedStocks.push(storedStock);
      }
    });

    this.stockdatastorage.set(
      "stocks",
      mergedStocks.map((stock) => ({
        symbol: stock.symbol,
        currency: stock.currency,
        price: stock.price,
      }))
    );
  }

  /**
   * Loads stocks from local storage.
   * If symbolsArray is provided, only stocks matching the symbols in the array are loaded.
   * @param {string[]} symbolsArray - Optional array of stock symbols to load from storage.
   */
  loadData(symbolsArray = []) {
    const storedStocks = this.stockdatastorage.get("stocks") || [];
    this.stocks = storedStocks
      .filter((stock) => symbolsArray.includes(stock.symbol))
      .map((stock) => new Stock(stock.symbol, stock.currency, stock.price));
  }

  /**
   * Creates a new stock and adds it to local storage, avoiding duplicates.
   * @param {string} symbol - The symbol of the new stock.
   * @param {number} price - The price of the new stock.
   * @param {string} currency - The currency of the new stock.
   */
  createNewStock(symbol, price, currency) {
    if (!this.getStock(symbol)) {
      const stock = new Stock(symbol, currency, price);
      this.stocks.push(stock);
      this.saveData();
    }
  }

  /**
   * Removes a stock from the current list by its symbol.
   * @param {string} symbol - The symbol of the stock to be removed.
   */
  removeStock(symbol) {
    this.stocks = this.stocks.filter((stock) => stock.symbol !== symbol);
  }

  /**
   * Retrieves a stock from the current list by its symbol.
   * @param {string} symbol - The symbol of the stock to find.
   * @returns {Stock|null} The found stock or null if not found.
   */
  getStock(symbol) {
    return this.stocks.find((stock) => stock.symbol === symbol);
  }

  /**
   * Returns the current list of stocks.
   * @returns {Stock[]} An array of stock objects.
   */
  getStocks() {
    return this.stocks;
  }

  /**
   * Retrieves an array of stock symbols from the current stock list.
   * @returns {string[]} An array of stock symbols.
   */
  getStockSymbols() {
    return this.stocks.map((stock) => stock.symbol);
  }

  /**
   * Updates the price and currency of an existing stock.
   * @param {string} symbol - The symbol of the stock to update.
   * @param {number} newPrice - The new price of the stock.
   * @param {string} newCurrency - The new currency of the stock.
   */
  updateStock(symbol, newPrice, newCurrency) {
    const stock = this.getStock(symbol);
    if (stock) {
      stock.price = newPrice;
      stock.currency = newCurrency;
    }
  }
}
