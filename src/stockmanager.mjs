import stockapi from './stockapi.mjs';
import DataStorage from './datastorage.mjs';
import EventEmitter from 'events';
import Store from 'electron-store';

const apiKey = '820dce8b60af47cd923c5302d5ea7cde';
const symbols = 'AAPL,EUR/USD,VFIAX';

export default class StockManager extends EventEmitter{
    constructor() {
        super();
        this.client = new stockapi(apiKey, symbols);
        this.client.connect();
        this.dataStorage = new DataStorage();
        this.stockdatastorage = new Store();
        this.loadData();

        this.client.on('updateStock', (data) => {
            this.updateData(data);
            this.emit('updated', this.dataStorage.stocks);
        });
    }

    loadData() {
        // Attempt to load stored stock data
        const storedStocks = this.stockdatastorage.get('stocks');
    
        if (storedStocks) {
            storedStocks.forEach(stock => {
                this.dataStorage.createNewStock(stock.symbol, stock.currency, stock.exchange, stock.price);
            });
        } else {
            console.log('No stored stock data found, initializing with default or fetching new data...');
        }
        this.emit('dataLoaded', this.dataStorage.stocks);
    }

    updateData(data) {
        if(data.event === "price")  {
        let currency = "USD";
        const symbol = data.symbol;
        const price = data.price.toFixed(2) ;
        const exchange = data.exchange;
        const stock = this.dataStorage.getStock(symbol);
        if (stock) {
            this.dataStorage.updatePrice(symbol, price);
        } else {
            this.dataStorage.createNewStock(symbol, currency, exchange, price);
        }
        }
    }

    addStock(symbol) {
        this.client.symbols += `,${symbol}`;
        this.client.updateSubscription();
        console.log('Updated symbols:', this.client.symbols);
    }


}
