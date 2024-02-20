import stockapi from "./stockapi.mjs";
import DataStorage from "./datastorage.mjs";
import EventEmitter from "events";
import Store from "electron-store";

const apiKey = "cna94r9r01qjv5ip8upgcna94r9r01qjv5ip8uq0";

export default class StockManager extends EventEmitter {
  constructor() {
    super();
    this.symbols = [];
    this.dataStorage = new DataStorage();

    this.stockdatastorage = new Store();
    this.loadSymbols(); //getstocksymbols
    this.loadData();

    this.client = new stockapi(apiKey, this.symbols);
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

  updateData(dataArray) {
    dataArray.forEach((data) => {
      // Check if each object in the array is a trade update. With Finnhub, trade updates contain the 's' field.
      if (data && data.s && data.p) {
        console.log("Trade update received for symbol:", data.s);
        let currency = "USD"; // Currency is assumed to be USD. Finnhub does not provide currency in trade updates.
        const symbol = data.s; // Symbol of the stock
        const price = parseFloat(data.p).toFixed(2); // Price of the trade

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
      // Add the new symbol
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
}
