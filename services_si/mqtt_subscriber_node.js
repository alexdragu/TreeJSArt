const mqtt = require('mqtt');

class MQTTSubscriber {
    MAIN_TOPIC = "sca_ces_demo/ranger5/radar_child_presence_detection_and_seat_belt_reminder/application_data";
    CIR_DATA = "cir_data";
    TOPIC_DELIMITER = "/";
    FULL_TOPIC = this.MAIN_TOPIC + this.TOPIC_DELIMITER + this.CIR_DATA;

    MESSAGE_QUEUE_SIZE = 100; // Maximum number of messages to store

    total_entries = 0 ;

    constructor(brokerUrl, options = {}) {
        this.brokerUrl = brokerUrl;
        this.options = options;
        this.client = null;
        this.messages = [];
        this._messageIndex = undefined; // Used for circular buffer logic
    }

    connect() {
        this.client = mqtt.connect(this.brokerUrl, this.options);

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker:', this.brokerUrl);
        });

        this.client.on('error', (err) => {
            console.error('MQTT connection error:', err);
        });
    }

    subscribe() {
        if (!this.client) {
            console.error('MQTT client not connected.');
            return;
        }
        this.client.subscribe(this.FULL_TOPIC, (err) => {
            if (err) {
                console.error('Subscribe error:', err);
            } else {
                console.log('Subscribed to topic:', this.FULL_TOPIC);
            }
        });

        this.client.on('message', (receivedTopic, message) => {
            if (receivedTopic === this.FULL_TOPIC) {
                //console.log(`Received message on topic ${receivedTopic}:`, message.toString());

                if (!this.messages) {
                    this.messages = [];
                }
                if (this.messages.length < this.MESSAGE_QUEUE_SIZE) {
                    this.messages.push(message.toString());
                    this._messageIndex = this.messages.length - 1; // Update index to the last message
                } else {
                    // Overwrite oldest message in a circular manner
                    this._messageIndex = (this._messageIndex === undefined) ? 0 : (this._messageIndex + 1) % this.MESSAGE_QUEUE_SIZE;
                    this.messages[this._messageIndex] = message.toString();
                }
                this.total_entries++;
                console.log(`Received message on topic idx: ${this._messageIndex}: ${this.total_entries}:`);
                //callback(message.toString());
            }
        });
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            console.log('Disconnected from MQTT broker.');
        }
    }

    getlastmessage() {
        if (this.messages.length === 0) {
            return null; // No messages available
        }
        // Return the last message in the circular buffer
        if (this._messageIndex === undefined || this._messageIndex <= 0) {
            if (this.messages.length < this.MESSAGE_QUEUE_SIZE) {
                return this.messages[this.MESSAGE_QUEUE_SIZE - 1]; 
            }
            return null; // No messages available or not initialized
        }
        return this.messages[this._messageIndex];
    }
}

module.exports = MQTTSubscriber;

