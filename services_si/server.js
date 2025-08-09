const express = require('express');
const cors = require('cors');
const https = require('https')
const fs = require("fs");
const MQTTSubscriber = require('./mqtt_subscriber_node');
//const mqttClient = new MQTTSubscriber('mqtt://broker.hivemq.com');
//const mqttClient = new MQTTSubscriber('mqtt://localhost:1883');
const mqttClient = new MQTTSubscriber('mqtt://192.168.0.39:1883');
const WebSocket = require('ws');

var privateKey  = fs.readFileSync('./sslcert/id.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/id.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

/*
 const corsOptions = {
   origin: 'https://www.demo.ro:30002',
   optionsSuccessStatus: 200,
 };
*/
 const corsOptions = {
  origin: 'https://localhost:30002',
  //origin: 'https://192.168.0.87:30002',
  optionsSuccessStatus: 200,
};


const app = express();
//app.use(cors(corsOptions));
app.use(cors(corsOptions));

const { parse } = require("csv-parse");

var formidable = require('formidable');

objData = [];
objFlatData = [];

class ObjectEntry {
  constructor(name, coordinates) {
    this.name = name;
    this.coordinates = coordinates;
  }
}

mqttClient.connect();
console.log('Starting MQTT subscriber...');

mqttClient.subscribe('test/topic', (msg) => {
    console.log('Received message:', msg);
});

console.log('Preparing wab point...');

app.get('/', (req, res) => {
  res.send('Map reader Service!');
});


app.get('/get_mqtt_uwb', (req, res) => {
  const objEntry = mqttClient.getlastmessage();
  const responseObj = { data: `${objEntry}`, index: `${mqttClient._messageIndex}` };  
  res.json(responseObj);
});


// Listen to the App Engine-specified port, or 8080 otherwise
//const PORT = process.env.PORT || 8082;
const PORT = 30001;
const hostname = '____.ro';

const server = https.createServer(credentials, app).listen(PORT);
//app.listen(PORT, () => {
//  console.log(`Server listening on port ${PORT}...`);
//});

const wss = new WebSocket.Server({ server });

let idxws = 0;
let totalidx = 0;
let rep = new Date().getTime();

wss.on('connection', (ws) => {
  console.log('WS Client connected');

  const interval = setInterval(() => {
    //ws.send(JSON.stringify({ time: new Date().toISOString() }));
    
    const objEntry = mqttClient.getlastmessage();
    //console.log('WS Sending data:', objEntry);


    //console.log('WS ARRAY Sending data:', objEntry);
    if(objEntry === undefined || objEntry === null) {
      console.error('Received undefined or null data');
      return;
    }

    const arr = JSON.parse(objEntry);/* your 2D array */

    console.log('WS ARRAY String len:', objEntry.length);

    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      console.error('Invalid or empty array received');
      return;
    }
    const flatArr = arr.flat(); // Flattens to 1D array

    // Create a Uint16Array and fill it
    const uint16 = new Uint16Array(flatArr);

    // Convert to ArrayBuffer for sending as binary
    const buffer = uint16.buffer;
    if (idxws<100) {
      
    } else{

      if ((idxws >= 100) && (new Date().getTime() - rep > 1000)){
        console.log('WS Sending buffer length:', buffer.byteLength, " idxws : ", idxws, " tidxws:",totalidx," time in ms:", new Date().getTime() - rep);      
        idxws=0;
        rep = new Date().getTime();
      }
//      console.log('Denied idxws : ', idxws);
//      return;
    }
    //console.log('WS Sending buffer XXX:', buffer);
    idxws++;
    totalidx++;
    ws.send(buffer, { binary: true }, (error) => {
      if (error) {
        console.error('Error sending data:', error);
      }
    });
    //console.log("sending: ",idxws); 
    //ws.send(JSON.stringify({ objEntry }));

  }, 10);

  ws.on('close', () => {
  console.log('WS Client disconnected');
    clearInterval(interval);
  });
});

wss.on('error', (error) => {
  console.error('WebSocket error:', error);
});
