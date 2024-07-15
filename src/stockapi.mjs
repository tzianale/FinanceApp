import WebSocket from "ws";
import EventEmitter from "events";

/**
 * Provides real-time stock data through a WebSocket connection.
 * Inherits from EventEmitter to manage events like connection open, errors, and stock updates.
 */
export default class StockAPI extends EventEmitter {
  /**
   * Initializes the StockAPI class with API key and symbols to track.
   * @param {string} apiKey - The API key required for the WebSocket service.
   * @param {string[]} symbols - Initial array of stock symbols to subscribe to.
   */
  constructor(apiKey, symbols) {
    super();
    this.apiKey = apiKey;
    this.symbols = symbols;
    this.ws = null;
    this.lastEmitTime = 0;
    this.emitInterval = 10000; // Minimum interval between emitting stock data events in milliseconds
  }

  /**
   * Updates the subscription list of stock symbols.
   * @param {string[]} symbols - Array of stock symbols to update the subscription to.
   */
  updateSubscription(symbols) {
    if (!Array.isArray(symbols)) {
      console.error("Invalid symbols: expected an array of symbols");
      return;
    }

    if (this.symbols && this.symbols.length > 0) {
      this.symbols.forEach((symbol) => {
        this.ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
      });
    }

    symbols.forEach((symbol) => {
      this.ws.send(JSON.stringify({ type: "subscribe", symbol }));
    });

    this.symbols = symbols;
    console.log("Subscription updated to:", symbols);
  }

  /**
   * Sets a new API key and restarts the WebSocket connection.
   * @param {string} key - The new API key.
   */
  setAPIKey(key) {
    this.apiKey = key;
    this.close();
    this.connect();
  }

  /**
   * Initiates the WebSocket connection and sets up handlers for the WebSocket events.
   */
  connect() {
    const endpoint = `wss://ws.finnhub.io?token=${this.apiKey}`;
    this.ws = new WebSocket(endpoint);

    this.ws.onopen = () => {
      console.log("WebSocket connection established to Finnhub");
      this.emit("open");

      if (!this.symbols.length) {
        console.error("No symbols to subscribe to");
        return;
      }

      this.symbols.forEach((symbol) => {
        this.ws.send(JSON.stringify({ type: "subscribe", symbol }));
      });
      console.log("Subscribed to:", this.symbols);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const currentTime = Date.now();
        if (
          currentTime - this.lastEmitTime >= this.emitInterval &&
          data.type === "trade"
        ) {
          this.emit("updateStock", data.data);
          this.lastEmitTime = currentTime;
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.log("WebSocket error:", error.message);
      this.emit("APIKey-Wrong");
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket connection to Finnhub closed", event.reason);
      this.emit("close");
    };
  }

  /**
   * Closes the WebSocket connection.
   */
  close() {
    if (this.ws) {
      this.ws.close(1000, "Closing connection by client request");
      console.log("Manually closing WebSocket connection to Finnhub");
    }
  }
}
