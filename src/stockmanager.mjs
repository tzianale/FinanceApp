import stockapi from "./stockapi.mjs";
import DataStorage from "./datastorage.mjs";
import EventEmitter from "events";
import Store from "electron-store";

/**
 * Manages stock data operations including API connectivity, storage, and updating stocks.
 * Inherits from EventEmitter to manage and emit events related to stock data operations.
 */
export default class StockManager extends EventEmitter {
  /**
   * Initializes a new instance of StockManager.
   */
  constructor() {
    super();
    this.symbols = [];
    this.dataStorage = new DataStorage();
    this.stockdatastorage = new Store();
    this.apiKeystorage = new Store();
    this.loadSymbols();
    this.loadData();
    this.apiKey = this.apiKeystorage.get("apikey") || "";
    this.client = new stockapi(this.apiKey, this.symbols);
    this.client.connect();

    this.client.on("open", () => {
      this.client.updateSubscription(this.symbols);
    });

    this.client.on("updateStock", (data) => {
      this.updateData(data);
      this.emit("updated", this.dataStorage.stocks);
    });

    this.client.on("APIKey-Wrong", () => {
      this.emit("APIKey-Error");
    });
  }

  /**
   * Saves the current symbols to local storage.
   */
  saveSymbols() {
    this.stockdatastorage.set("usedsymbols", this.symbols);
  }

  /**
   * Loads symbols from local storage.
   */
  loadSymbols() {
    const loadedSymbols = this.stockdatastorage.get("usedsymbols");
    this.symbols = Array.isArray(loadedSymbols) ? loadedSymbols : [];
  }

  /**
   * Loads stock data from the data storage based on loaded symbols.
   */
  loadData() {
    this.dataStorage.loadData(this.symbols);
    this.emit("dataLoaded", this.dataStorage.stocks);
  }

  /**
   * Updates the API key and reconnects the client.
   * @param {string} key - The new API key.
   */
  setAPIKey(key) {
    console.log("API Key received:", key);
    this.apiKey = key;
    this.client.setAPIKey(key);
    this.apiKeystorage.set("apikey", key);
  }

  /**
   * Processes and updates data for each stock received from the API.
   * @param {Object[]} dataArray - Array of stock data objects from the API.
   */
  updateData(dataArray) {
    dataArray.forEach((data) => {
      if (data && data.s && data.p) {
        console.log("Trade update received for symbol:", data.s);
        const symbol = data.s;
        const price = parseFloat(data.p).toFixed(2);
        const currency = "USD"; // Assumes currency is USD for all stocks

        if (this.dataStorage.getStock(symbol)) {
          this.dataStorage.updateStock(symbol, price, currency);
        } else {
          this.dataStorage.createNewStock(symbol, price, currency);
        }
        this.saveSymbols();
        this.dataStorage.saveData();
        this.emit("updated", this.dataStorage.stocks);
      }
    });
  }

  /**
   * Adds a stock to the manager and subscribes to updates from the API.
   * @param {string} symbol - Symbol of the stock to add.
   */
  addStock(symbol) {
    if (!this.symbols.includes(symbol)) {
      this.symbols.push(symbol);
      this.dataStorage.loadData(this.symbols);
      this.dataStorage.createNewStock(symbol, "loading", "");
      this.client.updateSubscription(this.symbols);
      this.dataStorage.saveData();
      this.saveSymbols();
      this.emit("updated", this.dataStorage.stocks);
    }
  }

  /**
   * Removes a stock from the manager and unsubscribes from updates.
   * @param {string} symbol - Symbol of the stock to remove.
   */
  removeStock(symbol) {
    if (this.symbols.includes(symbol)) {
      this.symbols = this.symbols.filter((s) => s !== symbol);
      this.dataStorage.removeStock(symbol);
      this.client.updateSubscription(this.symbols);
      this.saveSymbols();
      this.dataStorage.saveData();
    }
  }

  /**
   * Retrieves the current list of stocks managed by the stock manager.
   * @returns {Stock[]} - Array of current stocks.
   */
  getStocks() {
    this.dataStorage.loadData(this.symbols);
    return this.dataStorage.getStocks();
  }
}
