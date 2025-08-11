# PolygonCoordParser Tool Class

A utility class for parsing polygon coordinate strings from WKT (Well-Known Text) format into MapCoord objects for use with Three.js mapping applications.

## Overview

The `PolygonCoordParser` class has been extracted from the `LbMap` class to provide a dedicated tool for parsing polygon coordinates. This separation of concerns makes the code more modular and reusable.

## Features

- Parse POLYGON and MULTIPOLYGON strings from WKT format
- Convert coordinates to MapCoord objects with sphere or flat projection modes
- Validate polygon string formats
- Identify polygon types
- Parse individual coordinate pairs

## Usage

### Basic Usage

```javascript
import { PolygonCoordParser } from './PolygonCoordParser.js';

const polygonString = "POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))";
const mode = 1; // 0 for sphere, 1 for flat
const radius = 100;

const parsedCoords = PolygonCoordParser.parsePolygonCoords(polygonString, mode, radius);
```

### Validation

```javascript
// Check if a string is a valid polygon format
const isValid = PolygonCoordParser.isValidPolygonString(polygonString);

// Get the polygon type
const type = PolygonCoordParser.getPolygonType(polygonString); // Returns 'POLYGON', 'MULTIPOLYGON', or 'UNKNOWN'
```

### Coordinate Pair Parsing

```javascript
// Parse individual coordinate pairs
const coordPair = "10.5 20.3";
const { x, y } = PolygonCoordParser.parseCoordinatePair(coordPair);
```

## Methods

### Static Methods

- `parsePolygonCoords(polygonString, mode, R)` - Parse polygon coordinates into MapCoord arrays
- `isValidPolygonString(polygonString)` - Validate polygon string format
- `getPolygonType(polygonString)` - Identify polygon type
- `parseCoordinatePair(coordString)` - Parse individual coordinate pairs

## Parameters

- **polygonString**: String in WKT format (POLYGON or MULTIPOLYGON)
- **mode**: Coordinate mode (0 = sphere, 1 = flat)
- **R**: Radius for sphere coordinates
- **coordString**: Individual coordinate pair string

## Returns

- `parsePolygonCoords`: Array of polygon arrays, where each polygon is an array of MapCoord objects
- `isValidPolygonString`: Boolean indicating if the string is valid
- `getPolygonType`: String indicating polygon type
- `parseCoordinatePair`: Object with x and y properties

## Integration with LbMap

The `LbMap` class now uses the `PolygonCoordParser` internally, maintaining backward compatibility while benefiting from the modular design:

```javascript
// In LbMap class
parsePolygonCoords(polygonString, mode) {
    return PolygonCoordParser.parsePolygonCoords(polygonString, mode, this.R);
}
```

## Example

See `PolygonCoordParserExample.js` for a complete usage example.

## Dependencies

- MapCoord class from LbMap.js
- Three.js (indirectly through MapCoord)

## Benefits of Extraction

1. **Separation of Concerns**: Polygon parsing logic is isolated from map rendering logic
2. **Reusability**: The parser can be used independently in other projects
3. **Testability**: Easier to unit test the parsing logic
4. **Maintainability**: Changes to parsing logic don't affect the main map class
5. **Performance**: Static methods avoid unnecessary instance creation
