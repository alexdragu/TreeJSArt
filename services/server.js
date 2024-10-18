const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const fs = require("fs");
const { parse } = require("csv-parse");

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

fs.createReadStream("./images_robocop.csv")
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

/*
function parsePolygonCoords(polygonString) {
  // Extract the coordinates string
  const coordsString = polygonString.match(/\(([^)]+)\)/)[1];

  // Split the coordinates string into an array of strings
  const coordsArray = coordsString.split(',');

  // Map each string to a MapCoords object
  const mapCoordsArray = coordsArray.map(coordString => {
    const [x, y] = coordString.trim().split(' ').map(Number);
    return new MapCoords(x, y);
  });

  return mapCoordsArray;
}
*/

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});


