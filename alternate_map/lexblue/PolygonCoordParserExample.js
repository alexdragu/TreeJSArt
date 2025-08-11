import { PolygonCoordParser } from './PolygonCoordParser.js';
import { MapCoord } from './LbMap.js';

/**
 * Example usage of the PolygonCoordParser tool
 * This demonstrates how to use the parser independently of the LbMap class
 */

// Example polygon string in WKT format
const examplePolygon = "POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))";
const exampleMultiPolygon = "MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)), ((2 2, 3 2, 3 3, 2 3, 2 2)))";

// Example usage
console.log("Example: Using PolygonCoordParser independently");

// Check if strings are valid
console.log("Is valid polygon:", PolygonCoordParser.isValidPolygonString(examplePolygon));
console.log("Polygon type:", PolygonCoordParser.getPolygonType(examplePolygon));

// Parse polygon coordinates
const mode = 1; // flat mode
const R = 100;  // radius

try {
    const parsedCoords = PolygonCoordParser.parsePolygonCoords(examplePolygon, mode, R);
    console.log("Parsed coordinates:", parsedCoords);
    
    // Access individual coordinates
    if (parsedCoords.length > 0 && parsedCoords[0].length > 0) {
        const firstCoord = parsedCoords[0][0];
        console.log("First coordinate:", {
            x: firstCoord.x,
            y: firstCoord.y,
            z: firstCoord.z,
            mode: firstCoord.mode
        });
    }
} catch (error) {
    console.error("Error parsing polygon coordinates:", error);
}

// Example with coordinate pair parsing
const coordPair = "10.5 20.3";
const parsed = PolygonCoordParser.parseCoordinatePair(coordPair);
console.log("Parsed coordinate pair:", parsed);

export { /* No exports needed for example file */ };
