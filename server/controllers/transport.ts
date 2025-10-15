import * as express from 'express';
import * as cacheManager from 'cache-manager';
import * as fsStore from 'cache-manager-fs-hash';

import { createClient } from '@motis-project/motis-fptf-client';
import { profile } from '@motis-project/motis-fptf-client/p/transitous';

import { transportLocations } from '../assets/transportLocations';
import {
  TransportConnection,
  TransportDataResponse,
  TransportDirection
} from '../model/TransportModel';

// create a client with Transitous profile (disable station enrichment to avoid import/path issues with db-hafas-stations)
const motisClient = createClient(
  profile,
  'spluseins.de/team@spluseins.de/06.10.25',
  { enrichStations: false }
); // in case of changes, adjust the version date accordingly

// default must be in /tmp because the rest is RO on AWS Lambda
const CACHE_PATH = process.env.CACHE_PATH || '/tmp/spluseins-cache';
const CACHE_DISABLE = !!process.env.CACHE_DISABLE;
const CACHE_SECONDS = parseInt(process.env.TRANSPORT_CACHE_SECONDS || '60');

const router = express.Router();
const cache = CACHE_DISABLE
  ? cacheManager.caching({ store: 'memory', max: 0 })
  : cacheManager.caching({
    store: fsStore,
    options: {
      path: CACHE_PATH,
      ttl: 60,
      subdirs: true
    }
  });

router.options('/');

// helper: build locations metadata for tabs
const buildLocationsMeta = () =>
  Object.entries(transportLocations).map(([key, loc]) => ({
    key,
    name: loc.name,
    directions: loc.directions.map(d => ({
      label: d.label,
      osm: d.osm
    }))
  }));

// helper: fetch connections for a specific direction
async function fetchDirectionConnections(direction: TransportDirection): Promise<TransportConnection[]> {
  const motisOpts = {
    results: 5,
    language: 'de',
    deutschlandTicketConnectionsOnly: true
  };

  try {
    const journeys = await motisClient.journeys(direction.from, direction.to, motisOpts);

    const connections: TransportConnection[] = journeys.journeys
      .map(({ legs }) => {
        const firstLeg = legs[0];
        const lastLeg = legs[legs.length - 1];

        return {
          departure: firstLeg.departure,
          arrival: lastLeg.arrival,
          line: firstLeg.line?.name || lastLeg.line?.name,
          mode: firstLeg.line?.mode || lastLeg.line?.mode,
          direction: firstLeg.direction || lastLeg.destination?.name,
          legs: legs.length,
          duration: new Date(lastLeg.arrival).getTime() - new Date(firstLeg.departure).getTime()
        };
      })
      .sort((a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime());

    return connections;
  } catch (error) {
    console.error(`Error fetching ${direction.label?.from} → ${direction.label?.to}:`, error);
    return [];
  }
}

// helper: load a single location
async function loadSingleLocation(locationKey: string): Promise<TransportDataResponse> {
  const locationData = transportLocations[locationKey];
  const results: { [directionKey: string]: TransportConnection[] } = {};

  const directionResults = await Promise.all(
    locationData.directions.map(async (direction) => {
      const connections = await fetchDirectionConnections(direction);
      const directionKey = `${direction.label.from} → ${direction.label.to}`;
      return { directionKey, connections };
    })
  );

  directionResults.forEach(({ directionKey, connections }) => {
    results[directionKey] = connections;
  });

  return {
    location: locationData.name,
    directions: results,
    lastUpdated: Date.now()
  };
}

// /api/transport
// Behavior:
// - No ?location param: return only locations metadata (for tabs), NO data loaded
// - With ?location=KEY: load ONLY that location, plus always all locations metadata
// Cache keys:
// - Without location: 'transport_locations_meta'
// - With location=KEY: 'transport_location_KEY'
router.get('/', async (req, res, next) => {
  const locationKey = (req.query.location as string) || undefined;
  const cacheKey = locationKey ? `transport_location_${locationKey}` : 'transport_locations_meta';

  try {
    const payload = await cache.wrap(cacheKey, async () => {
      const locations = buildLocationsMeta();

      if (!locationKey || !transportLocations[locationKey]) {
        return {
          locations,
          data: {},
          lastUpdated: Date.now(),
          ttlSeconds: CACHE_SECONDS
        };
      }

      const one = await loadSingleLocation(locationKey);
      return {
        locations,
        data: { [locationKey]: one },
        lastUpdated: Date.now(),
        ttlSeconds: CACHE_SECONDS
      };
    }, { ttl: CACHE_SECONDS });

    res.set('Cache-Control', `public, max-age=${CACHE_SECONDS}`);
    res.json(payload);
  } catch (error) {
    console.error('Error fetching transport data:', error);
    next(error);
  }
});

router.options('/');

export default router;
