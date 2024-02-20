import WebSocket from 'ws';
import EventEmitter from 'events';

export default class StockAPI extends EventEmitter {
    constructor(apiKey, symbols) {
        super();
        this.apiKey = apiKey;
        this.symbols = symbols;
        this.ws = null;
        this.lastEmitTime = 0;
        this.emitInterval = 10000; 
    }

    updateSubscription(symbols) {
        if (!Array.isArray(symbols)) {
            console.error('Invalid symbols: expected an array of symbols');
            return;
        }
    
        // Unsubscribe from previous topics if any
        if (this.symbols && this.symbols.length > 0) {
            this.symbols.forEach((symbol) => {
                this.ws.send(JSON.stringify({'type': 'unsubscribe', 'symbol': symbol}));
            });
        }
    
        // Subscribe to new symbols
        symbols.forEach((symbol) => {
            this.ws.send(JSON.stringify({'type': 'subscribe', 'symbol': symbol}));
        });
        
        this.symbols = symbols;
        console.log('Subscription updated to:', symbols);
    }

    connect() {
        const endpoint = `wss://ws.finnhub.io?token=${this.apiKey}`;
        this.ws = new WebSocket(endpoint);
    
        this.ws.onopen = () => {
            console.log('WebSocket connection established to Finnhub');
    
            if (!Array.isArray(this.symbols) || this.symbols.length === 0) {
                console.error('No symbols to subscribe to');
                return;
            }
    
            // Subscribe to symbols
            this.symbols.forEach((symbol) => {
                this.ws.send(JSON.stringify({'type': 'subscribe', 'symbol': symbol}));
            });
            console.log('Subscribed to:', this.symbols);
    
            this.emit('open');
        };

        this.ws.onmessage = (event) => {
            let data;
            try {
                data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                
                // Check if it's time to emit an update
                const currentTime = Date.now();
                if (currentTime - this.lastEmitTime >= this.emitInterval) {
                    if (data.type === 'trade') {
                        this.emit('updateStock', data.data);
                    }
                    this.lastEmitTime = currentTime; // Reset the timer
                }
            } catch (error) {
                console.error('Error parsing message data:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket connection to Finnhub closed', event.reason);
        };
    }

    close() {
        if (this.ws) {
            this.ws.close(1000, 'Closing connection by client request');
            console.log('Manually closing WebSocket connection to Finnhub');
        }
    }
}
