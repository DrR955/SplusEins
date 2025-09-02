import express from 'express';
import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';
import { createClient } from 'db-vendo-client';
import { profile as dbProfile } from 'db-vendo-client/p/db/index.js';

// static ESM import, Node 22+ required
const getHafasClient = async () => createClient(dbProfile, 'spluseins.de');

// const hafasClient = createClient(dbProfile, 'spluseins.de');

// default must be in /tmp because the rest is RO on AWS Lambda
const CACHE_PATH = process.env.CACHE_PATH || '/tmp/spluseins-cache';
const CACHE_DISABLE = !!process.env.CACHE_DISABLE;
const CACHE_SECONDS = parseInt(process.env.BUS_CACHE_SECONDS || '60');

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

router.get('/', async (req, res, next) => {
  const hafasOpts = {
    results: 5,
    language: 'de',
    startWithWalking: false
  }

  const exer = '891011' // await hafasClient.locations('Wolfenbüttel Exer Süd')
  const fh = '891038'

  try {
    const hafasClient = await getHafasClient();
    const data = await cache.wrap('bus', async () => {
      console.log('bus cache miss for key bus');

      const exerToFh = await hafasClient.journeys(exer, fh, hafasOpts)
      const fhToExer = await hafasClient.journeys(fh, exer, hafasOpts)
      const extractDateAndLine = (journeys) => journeys
        .map(({ legs }) => legs)
        .filter(legs => legs.length == 1)
        .map(legs => legs[0])
        .map(leg => ({
          date: leg.departure,
          line: leg.line.name.replace('Bus ', '') // remove Bus string at start
        }))
        .sort((a, b) => Date.parse(a) - Date.parse(b));

      return {
        exerToFh: extractDateAndLine(exerToFh.journeys),
        fhToExer: extractDateAndLine(fhToExer.journeys)
      }
    }, { ttl: CACHE_SECONDS });

    res.set('Cache-Control', `public, max-age=${CACHE_SECONDS}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
