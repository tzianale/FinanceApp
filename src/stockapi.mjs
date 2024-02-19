import WebSocket from 'ws';
import EventEmitter from 'events';

export default class stockapi  extends EventEmitter{
    constructor(apiKey, symbols) {
        super();
        this.apiKey = apiKey;
        this.symbols = symbols;
        this.ws = null;
        this.heartbeatInterval = null;
    }

    reset = {"action": "reset"}

    updateSubscription(symbols) {
        const subscriptionMessage = {
            action: "subscribe",
            params: {
                symbols: symbols
            }
        };
        this.ws.send(JSON.stringify(this.reset));
        this.ws.send(JSON.stringify(subscriptionMessage));
        console.log('Subscription updated to:', symbols);
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
            console.log('Subscription message:', subscriptionMessage);

            this.heartbeatInterval = setInterval(() => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({action: "heartbeat"}));
                    console.log('Sending heartbeat to keep the WebSocket connection alive');
                }
            }, 30000);

            this.emit('open');   
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
            if (this.ws) {
                clearInterval(this.heartbeatInterval); // Stop sending heartbeat messages
                this.ws.close(1000, 'Closing connection by client request');
                console.log('Manually closing WebSocket connection to Twelve Data');
            }
        };
    }

    close() {
        if (this.ws) {
            this.ws.close(1000, 'Closing connection by client request');
            console.log('Manually closing WebSocket connection to Twelve Data');
        }
    }
}