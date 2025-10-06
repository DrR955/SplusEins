/**
 * Represents a single direction/route between two locations
 */
export interface TransportDirection {
  /** Display name for this route (e.g., "FH → Hauptbahnhof") */
  name: string;
  /** DELFI station ID for the departure location */
  from: string;
  /** DELFI station ID for the destination location */
  to: string;
}

/**
 * Represents a transport location with multiple routes
 */
export interface TransportLocation {
  /** Display name of the location (e.g., "Wolfenbüttel") */
  name: string;
  /** Array of available routes from/to this location */
  directions: TransportDirection[];
}

/**
 * Map of location keys to their configuration
 */
export interface TransportLocations {
  [key: string]: TransportLocation;
}

/**
 * Represents a single departure/connection
 */
export interface TransportConnection {
  /** ISO 8601 departure time */
  departure: string;
  /** ISO 8601 arrival time */
  arrival: string;
  /** Line/route name (e.g., "420", "RE 1") */
  line: string;
  /** Transport mode (bus, train, tram, etc.) */
  mode: string;
  /** Direction/destination name */
  direction?: string;
  /** Number of legs in this journey */
  legs: number;
  /** Number of transfers required */
  transfers: number;
  /** Journey duration */
  duration: number;
}

/**
 * API response for transport data (single location)
 */
export interface TransportDataResponse {
  /** Name of the location */
  location: string;
  /** Map of direction names to their connections */
  directions: {
    [directionName: string]: TransportConnection[];
  };
  /** Timestamp when data was last updated to show in frontend */
  lastUpdated: number;
}
