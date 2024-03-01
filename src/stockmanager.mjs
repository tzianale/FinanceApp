import stockapi from "./stockapi.mjs";
import DataStorage from "./datastorage.mjs";
import EventEmitter from "events";
import Store from "electron-store";


export default class StockManager extends EventEmitter {
  constructor() {
    super();
    this.symbols = [];
    this.dataStorage = new DataStorage();

    this.stockdatastorage = new Store();
    this.apiKeystorage = new Store();
    this.loadSymbols(); //getstocksymbols
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



  saveSymbols() {
    this.stockdatastorage.set("usedsymbols", this.symbols);
  }

  loadSymbols() {
    const loadedSymbols = this.stockdatastorage.get("usedsymbols");
    this.symbols = Array.isArray(loadedSymbols) ? loadedSymbols : [];
}

  loadData() {
    this.dataStorage.loadData(this.symbols);
    this.emit("dataLoaded", this.dataStorage.stocks);
  }

  setAPIKey(key) { 
    console.log("API Key received:", key);
  }

  updateData(dataArray) {
    dataArray.forEach((data) => {
      if (data && data.s && data.p) {
        console.log("Trade update received for symbol:", data.s);
        let currency = "USD";
        const symbol = data.s;
        const price = parseFloat(data.p).toFixed(2);

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

  addStock(symbol) {
    if (!this.symbols.includes(symbol)) {
      this.symbols.push(symbol);
      this.dataStorage.loadData(this.symbols); // Assuming loadData can accept an array
      this.dataStorage.createNewStock(symbol, "loading", "");
      this.client.updateSubscription(this.symbols);
      this.dataStorage.saveData();
      this.saveSymbols();
      this.emit("updated", this.dataStorage.stocks);
    }
  }

  removeStock(symbol) {
    if (this.symbols.includes(symbol)) {
      this.symbols = this.symbols.filter((s) => s !== symbol);
      this.dataStorage.removeStock(symbol);
      this.client.updateSubscription(this.symbols);
      this.saveSymbols();
      this.dataStorage.saveData();
    }
  }

  getStocks() {
    this.dataStorage.loadData(this.symbols);
    return this.dataStorage.getStocks();
  }

  setAPIKey(key) {
    console.log("API Key received:", key);
    this.apiKey = key;
    this.client.setAPIKey(key);
    this.apiKeystorage.set("apikey", key);
  }
}
