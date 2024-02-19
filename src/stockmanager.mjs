import stockapi from './stockapi.mjs';
import DataStorage from './datastorage.mjs';
import EventEmitter from 'events';
import Store from 'electron-store';

const apiKey = '820dce8b60af47cd923c5302d5ea7cde';

export default class StockManager extends EventEmitter{
    constructor() {
        super();
        this.symbols;
        this.client = new stockapi(apiKey, this.symbols);
        this.client.connect();
        this.dataStorage = new DataStorage();

        this.stockdatastorage = new Store();
        this.loadSymbols();
        this.loadData();

        this.client.on('open', () => {
            this.client.updateSubscription(this.symbols);
        });


        this.client.on('updateStock', (data) => {
            this.updateData(data);
            this.emit('updated', this.dataStorage.stocks);
        });
    }

    saveSymbols() {
        this.stockdatastorage.set('symbols', this.symbols);
    }

    loadSymbols() {
        this.symbols = this.stockdatastorage.get('symbols');
    }

    loadData() {
        this.dataStorage.loadData(this.symbols.split(','));
        this.emit('dataLoaded', this.dataStorage.stocks);
    }

    updateData(data) {
        console.log('Data received from stock API:', data);
        if(data.event === "price")  {
            let currency = "USD";
            const symbol = data.symbol;
            const price = data.price.toFixed(2) ;
            const exchange = data.exchange;

            if (this.dataStorage.getStock(symbol)) {
                this.dataStorage.updateStock(symbol, price, currency, exchange);
            } else {
                this.dataStorage.createNewStock(symbol, currency, exchange, price);
            }

            this.dataStorage.saveData();
            this.saveSymbols();
        }
    }

    addStock(symbol) {
        const symbolsArray = this.symbols.split(',');
        if (!symbolsArray.includes(symbol)) {
            this.symbols += `,${symbol}`;
            this.dataStorage.createNewStock(symbol, "", "loading", "loading");
            this.dataStorage.loadData(symbol);
            this.saveSymbols();
            this.client.updateSubscription(this.symbols);

            this.dataStorage.saveData();
        }
    }

    removeStock(symbol) {
        const symbolsArray = this.symbols.split(',');
        if (symbolsArray.includes(symbol)) {
            this.symbols = symbolsArray.filter(s => s !== symbol).join(',');

            this.dataStorage.removeStock(symbol);
            this.client.updateSubscription();
            this.saveSymbols();
            this.dataStorage.saveData();
        }
    }

}
