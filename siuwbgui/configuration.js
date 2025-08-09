// Configuration file for SI UWB GUI
const config = {
    websocket: {
        ip: '192.168.0.39',
        port: 30001,
        protocol: 'wss'
    },
    
    // Helper function to get the full WebSocket URL
    getWebSocketUrl: function() {
        return `${this.websocket.protocol}://${this.websocket.ip}:${this.websocket.port}`;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.config = config;
}
