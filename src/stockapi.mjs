import WebSocket from 'ws';

export default class stockapi {
    constructor(apiKey, symbols, closeAfterMs = null) {
        this.apiKey = apiKey;
        this.symbols = symbols;
        this.closeAfterMs = closeAfterMs;
        this.ws = null;
    }

    connect() {
        // Twelve Data WebSocket endpoint for real-time price updates
        const endpoint = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${this.apiKey}&symbols=${this.symbols}`;

        this.ws = new WebSocket(endpoint);

        this.ws.onopen = () => {
            console.log('WebSocket connection established to Twelve Data');

            // Send subscription message right after the connection opens
            const subscriptionMessage = {
                action: "subscribe",
                params: {
                    symbols: this.symbols
                }
            };
            this.ws.send(JSON.stringify(subscriptionMessage));

            // If specified, schedule the connection to close
            if (this.closeAfterMs) {
                setTimeout(() => this.close(), this.closeAfterMs);
            }
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received update:', data);
        
            // Assuming the data contains an array of updates, you might iterate over them
            // This is just an example; adjust based on the actual structure of the returned data
            if (Array.isArray(data)) {
                data.forEach(update => {
                    console.log(`Symbol: ${update.symbol}, Price: ${update.price}, Timestamp: ${update.timestamp}`);
                });
            } else {
                // If the data is not an array, print it directly (or handle as needed)
                console.log(data);
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