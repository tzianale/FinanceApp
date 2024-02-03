import WebSocket from 'ws';
import EventEmitter from 'events';

export default class stockapi  extends EventEmitter{
    constructor(apiKey, symbols) {
        super();
        this.apiKey = apiKey;
        this.symbols = symbols;
        this.ws = null;
    }

    reset = {"action": "reset"}

    updateSubscription() {
        const subscriptionMessage = {
            action: "subscribe",
            params: {
                symbols: this.symbols
            }
        };
        this.ws.send(JSON.stringify(this.reset));
        this.ws.send(JSON.stringify(subscriptionMessage));
    }

    connect() {
        // Twelve Data WebSocket endpoint for real-time price updates
        const endpoint = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${this.apiKey}&symbols=${this.symbols}`;

        this.ws = new WebSocket(endpoint);

        this.ws.onopen = () => {
            console.log('WebSocket connection established to Twelve Data');
            const subscriptionMessage = {
                action: "subscribe",
                params: {
                    symbols: this.symbols
                }
            };
            this.ws.send(JSON.stringify(subscriptionMessage));
        };

        this.ws.onmessage = (event) => {
            let data;
            try {
                data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                this.emit('updateStock', data); 
            } catch (error) {
                console.error('Error parsing message data:', error);
                return;
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket connection to Twelve Data closed', event.reason);
        };
    }

    close() {
        if (this.ws) {
            this.ws.close(1000, 'Closing connection by client request');
            console.log('Manually closing WebSocket connection to Twelve Data');
        }
    }
}