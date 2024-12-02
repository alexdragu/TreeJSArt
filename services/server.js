const express = require('express');
const cors = require('cors');
const https = require('https')
const fs = require("fs");

var privateKey  = fs.readFileSync('./sslcert/id.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/id.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

/*
 const corsOptions = {
   origin: 'https://www.interactivedigital.ro:30002',//(https://your-client-app.com)
   optionsSuccessStatus: 200,
 };
*/
 const corsOptions = {
  origin: 'https://localhost:30002',//(https://your-client-app.com)
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

console.log('Loading sphere images...');
 
fs.createReadStream("./ne_110m_admin_0_sovereignty.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
      //console.log(row[3] + " : " + row.length +  row[168]); // print the cell from column 214
      objData.push(new ObjectEntry(row[3], row[168]));
      console.log(row[3]);
      //console.log(objData[objData.length-1].name +"->"+ objData[objData.length-1].coordinates);
  })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });

  console.log('Loading flat images...');

//fs.createReadStream("./images_robocop.csv")
//fs.createReadStream("./monalisa.csv")
//fs.createReadStream("./monalisa_small.txt")
fs.createReadStream("./objects_vector_small.csv")

//fs.createReadStream("./robocop_big.csv")
//fs.createReadStream("./robocop_div2.csv")
.pipe(parse({ delimiter: ",", from_line: 1 }))
.on("data", function (row) {
    //console.log(row[3] + " : " + row.length +  row[168]); // print the cell from column 214
    objFlatData.push(new ObjectEntry(row[0], row[1]));
    console.log(row[0]);
    //console.log(objFlatData[objData.length-1].name +"->"+ objData[objFlatData.length-1].coordinates);
})
.on("end", function () {
  console.log("finished");
})
.on("error", function (error) {
  console.log(error.message);
});

app.get('/', (req, res) => {
  res.send('Map reader Service!');
});

app.post('/vectorupload', (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    res.write('File uploaded');

    console.log(fields);
    console.log(files);

    console.log (files.filetoupload[0]);

    var oldpath = files.filetoupload[0].filepath;
    //var newpath = 'D:/Temp/vectorimages/' + files.filetoupload[0].originalFilename;
    var newpath = '../alternate_map/textures/' + files.filetoupload[0].originalFilename;

    console.log(oldpath);
    console.log(newpath);

    fs.copyFile(oldpath, newpath, function (err) {
      if (err) throw err;
      fs.unlinkSync(oldpath);
      res.write('File uploaded and moved!');
      res.end();
    });

  });
  
});

// get number of sphere coordinates objects
app.get('/get_count', (req, res) => {
  console.log(objData.length);
  const responseObj = { countx : `${objData.length}` };
  res.send(responseObj);
});

app.get('/get_flat_count', (req, res) => {
  console.log(objFlatData.length);
  const responseObj = { countx : `${objFlatData.length}` };
  res.send(responseObj);
});

app.get('/get_entry', (req, res) => {
  const objEntry = req.query.obj_entry;
  const responseObj = { name: `${objData[objEntry].name}` , coordinates: `${objData[objEntry].coordinates}`};
  res.json(responseObj);
});

app.get('/get_flat_entry', (req, res) => {
  const objEntry = req.query.obj_entry;
  const responseObj = { name: `${objFlatData[objEntry].name}` , coordinates: `${objFlatData[objEntry].coordinates}`};
  res.json(responseObj);
});

// Listen to the App Engine-specified port, or 8080 otherwise
//const PORT = process.env.PORT || 8082;
const PORT = 30001;
const hostname = 'interactivedigital.ro';

https.createServer(credentials, app).listen(PORT);
//app.listen(PORT, () => {
//  console.log(`Server listening on port ${PORT}...`);
//});


