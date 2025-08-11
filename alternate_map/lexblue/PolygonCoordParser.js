import { MapCoord } from './LbMap.js';

/**
 * PolygonCoordParser - A utility class for parsing polygon coordinate strings
 * Supports parsing POLYGON and MULTIPOLYGON strings into MapCoord arrays
 */
class PolygonCoordParser {
    constructor() {
        // Static utility class - no instance variables needed
    }

    /**
     * Parse polygon coordinates from WKT (Well-Known Text) format strings
     * @param {string} polygonString - The polygon string to parse (POLYGON or MULTIPOLYGON format)
     * @param {number} mode - The coordinate mode (0 for sphere, 1 for flat)
     * @param {number} R - The radius for sphere coordinates
     * @returns {Array<Array<MapCoord>>} Array of polygon arrays, where each polygon is an array of MapCoord objects
     */
    static parsePolygonCoords(polygonString, mode, R) {
        // Remove the "POLYGON " prefix and split the string into polygons
        // prefix may be POLYGON or MULTIPOLYGON
        
        const firstParenthesisPosition = polygonString.indexOf('(');
        console.log("Polygon type: " + mode);
        console.log(firstParenthesisPosition);
        
        const polygons = polygonString.slice(firstParenthesisPosition + 1).split('), (');
        
        // Map each polygon string to an array of MapCoord objects
        const mapCoordsArrays = polygons.map(polygonString => {
            // Remove the leading and trailing parentheses
            const coordsString = polygonString.slice(1, -2);
            // Split the coordinates string into an array of strings
            const coordsArray = coordsString.split(',');
            
            // Map each string to a MapCoord object
            return coordsArray.map(coordString => {
                const sanitizedCoordStringF = coordString.substring(0, 1) === '(' ? coordString.slice(1) : coordString;
                
                const trimmedCoordString = sanitizedCoordStringF.trim();
                const lastCharacter = trimmedCoordString.slice(-1);
                const sanitizedCoordString = lastCharacter === ')' ? trimmedCoordString.slice(0, -1) : trimmedCoordString;
                
                const [x, y] = sanitizedCoordString.trim().split(' ').map(Number);
                // console.log("x:" + x + " y:" + y);
                
                var mapCoord = new MapCoord(x * (Math.PI) / 180.0, y * (Math.PI) / (180.0), R, mode);
                return mapCoord;
            });
        });
        
        return mapCoordsArrays;
    }

    /**
     * Validate if a string appears to be a valid polygon format
     * @param {string} polygonString - The string to validate
     * @returns {boolean} True if the string appears to be a valid polygon format
     */
    static isValidPolygonString(polygonString) {
        if (typeof polygonString !== 'string' || polygonString.length === 0) {
            return false;
        }
        
        const upperCaseString = polygonString.toUpperCase();
        return (upperCaseString.includes('POLYGON') || upperCaseString.includes('MULTIPOLYGON')) &&
               polygonString.includes('(') && polygonString.includes(')');
    }

    /**
     * Get the polygon type from a polygon string
     * @param {string} polygonString - The polygon string to analyze
     * @returns {string} The polygon type ('POLYGON', 'MULTIPOLYGON', or 'UNKNOWN')
     */
    static getPolygonType(polygonString) {
        if (!polygonString || typeof polygonString !== 'string') {
            return 'UNKNOWN';
        }
        
        const upperCaseString = polygonString.toUpperCase();
        if (upperCaseString.startsWith('MULTIPOLYGON')) {
            return 'MULTIPOLYGON';
        } else if (upperCaseString.startsWith('POLYGON')) {
            return 'POLYGON';
        } else {
            return 'UNKNOWN';
        }
    }

    /**
     * Parse a simple coordinate pair string into x,y values
     * @param {string} coordString - The coordinate string (e.g., "x y")
     * @returns {Object} Object with x and y properties
     */
    static parseCoordinatePair(coordString) {
        const sanitizedCoordStringF = coordString.substring(0, 1) === '(' ? coordString.slice(1) : coordString;
        
        const trimmedCoordString = sanitizedCoordStringF.trim();
        const lastCharacter = trimmedCoordString.slice(-1);
        const sanitizedCoordString = lastCharacter === ')' ? trimmedCoordString.slice(0, -1) : trimmedCoordString;
        
        const [x, y] = sanitizedCoordString.trim().split(' ').map(Number);
        
        return { x, y };
    }
}

export { PolygonCoordParser };
