import stockapi from './stockapi.mjs';
import DataStorage from './datastorage.mjs';
import EventEmitter from 'events';
import Store from 'electron-store';

const apiKey = '820dce8b60af47cd923c5302d5ea7cde';

export default class StockManager extends EventEmitter{
    constructor() {
        super();
        this.symbols = "";
        this.client = new stockapi(apiKey, this.symbols);
        this.client.connect();
        this.dataStorage = new DataStorage();
        this.stockdatastorage = new Store();
        this.loadData();

        this.client.on('updateStock', (data) => {
            this.updateData(data);
            this.emit('updated', this.dataStorage.stocks);
        });
    }

    saveData() {
        const stockData = this.dataStorage.stocks.map(stock => ({
            symbol: stock.symbol,
            currency: stock.currency,
            exchange: stock.exchange,
            price: stock.price,
        }));
        this.stockdatastorage.set('stocks', stockData);
        this.stockdatastorage.set('symbols', this.symbols);
    }

    loadData() {
        const storedStocks = this.stockdatastorage.get('stocks');
        const symbolsArray = this.symbols.split(',');

        const storedSymbols = this.stockdatastorage.get('symbols');
        if (storedSymbols) {
            this.symbols = storedSymbols;
            console.log('Stored symbols found, loading...', this.symbols);
        }

        if (storedStocks) {
            console.log('Stored stock data found, loading...');
            storedStocks.forEach(stock => {
                console.log('Loaded stock data before if:', stock.symbol);
                console.log('symbolsArray:', symbolsArray);
                if (symbolsArray.includes(stock.symbol)) {
                    console.log('Loaded stock data after if:', stock.symbol);
                    this.dataStorage.createNewStock(stock.symbol, stock.currency, stock.exchange, stock.price);
                    console.log('Loaded stock data:', stock.symbol);
                } else {
                    console.log('Symbol not found:', stock.symbol);
                }
            });
        } else {
            console.log('No stored stock data found, initializing with default or fetching new data...');
        }
        console.log("this.dataStorage.stocks");
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
        this.saveData();
        }
    }

    addStock(symbol) {
        const symbolsArray = this.symbols.split(',');
        if (!symbolsArray.includes(symbol)) {
            this.symbols += `,${symbol}`;
            console.log('Updated symbols:', this.symbols);
            this.loadData();
            this.client.updateSubscription();
            this.saveData();
            if ( dataStorage.getStock(symbol) == null) {
                dataStorage.createNewStock(symbol, "USD", "loading", "loading");
            }
        } else {
            console.log('Symbol already exists:', symbol);
        }
    }

    removeStock(symbol) {
        const symbolsArray = this.symbols.split(',');
        if (symbolsArray.includes(symbol)) {
            this.symbols = symbolsArray.filter(s => s !== symbol).join(',');
            console.log('Updated symbols:', this.symbols);
            this.dataStorage.removeStock(symbol);
            this.client.updateSubscription();
        } else {
            // Log a message if the symbol doesn't exist
            console.log('Symbol not found:', symbol);
        }
    }


}
