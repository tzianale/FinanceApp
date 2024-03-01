import Stock from "./stock.mjs";
import Store from "electron-store";

export default class DataStorage {
  constructor() {
    this.stocks = [];
    this.stockdatastorage = new Store();
    this.loadData();
  }

  saveData() {
    // Retrieve the currently stored stocks
    const storedStocks = this.stockdatastorage.get("stocks") || [];

    const filteredStoredStocks = storedStocks.filter(
      (stock) => stock.price && stock.price !== "loading"
    );

    // Merge current stocks with stored ones
    const mergedStocks = [...this.stocks];
    filteredStoredStocks.forEach((storedStock) => {
      if (!mergedStocks.some((stock) => stock.symbol === storedStock.symbol)) {
        mergedStocks.push(storedStock);
      }
    });

    // Update the stocks in storage
    this.stockdatastorage.set(
      "stocks",
      mergedStocks.map((stock) => ({
        symbol: stock.symbol,
        currency: stock.currency,
        price: stock.price,
      }))
    );
  }

  loadData(symbolsArray = []) {
    const storedStocks = this.stockdatastorage.get("stocks") || [];
    this.stocks = storedStocks
      .filter(
        (stock) =>
          symbolsArray.includes(stock.symbol)
      )
      .map((stock) => new Stock(stock.symbol, stock.currency, stock.price));
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
    this.stocks = this.stocks.filter((stock) => stock.symbol !== symbol);
  }

  getStock(symbol) {
    return this.stocks.find((stock) => stock.symbol === symbol);
  }

  getStocks() {
    return this.stocks;
  }

  getStockSymbols() {
    return this.stocks.map((stock) => stock.symbol);
  }

  updateStock(symbol, newPrice, newCurrency) {
    const stock = this.getStock(symbol);
    if (stock) {
      stock.price = newPrice;
      stock.currency = newCurrency;
    }
  }
}
