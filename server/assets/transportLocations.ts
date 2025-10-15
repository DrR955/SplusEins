import { TransportLocations } from '../model/TransportModel';

/**
 * Configuration for all supported Ostfalia transport locations
 *
 * Each location includes the campus name and available routes with their
 * corresponding DELFI station IDs for public transport queries.
 *
 * Acquire station IDs via await motisClient.locations('Wolfenbüttel Exer Süd') in controllers/transport.ts
 */
export const transportLocations: TransportLocations = {
  wf: {
    name: 'Wolfenbüttel',
    directions: [
      {
        label: { from: 'FH', to: 'Am Exer' },
        from: 'de-DELFI_de:03158:598:0:1',
        to: 'de-DELFI_de:03158:599:0:1',
        osm: {
          from: 'https://www.openstreetmap.org/node/1086994487',
          to: 'https://www.openstreetmap.org/node/2335632765'
        }
      },
      {
        label: { from: 'Am Exer', to: 'FH' },
        from: 'de-DELFI_de:03158:599:0:1',
        to: 'de-DELFI_de:03158:598:0:1',
        osm: {
          from: 'https://www.openstreetmap.org/node/2335632765',
          to: 'https://www.openstreetmap.org/node/1086994487'
        }
      }
    ]
  },
  wob: {
    name: 'Wolfsburg',
    directions: [
      {
        label: { from: 'Wolfsburg Imperial (FH)', to: 'Hauptbahnhof' },
        from: 'de-DELFI_de:03103:567:0:1',
        to: 'de-DELFI_de:03103:2015',
        osm: {
          from: 'https://www.openstreetmap.org/node/1723371019',
          to: 'https://www.openstreetmap.org/node/338899629'
        }
      },
      {
        label: { from: 'Hauptbahnhof', to: 'Wolfsburg Imperial (FH)' },
        from: 'de-DELFI_de:03103:2015',
        to: 'de-DELFI_de:03103:567:0:1',
        osm: {
          from: 'https://www.openstreetmap.org/node/338899629',
          to: 'https://www.openstreetmap.org/node/1723371019'
        }
      }
    ]
  },
  sud: {
    name: 'Suderburg',
    directions: [
      {
        label: { from: 'Suderburg Bahnhof', to: 'Uelzen Bahnhof' },
        from: 'de-VBN_000000817700',
        to: 'de-DELFI_de:03360:92160',
        osm: {
          from: 'https://www.openstreetmap.org/node/2959240815',
          to: 'https://www.openstreetmap.org/node/4725309874'
        }
      },
      {
        label: { from: 'Uelzen Bahnhof', to: 'Suderburg Bahnhof' },
        from: 'de-DELFI_de:03360:92160',
        to: 'de-VBN_000000817700',
        osm: {
          from: 'https://www.openstreetmap.org/node/4725309874',
          to: 'https://www.openstreetmap.org/node/2959240815'
        }
      }
    ]
  },
  sz: {
    name: 'Salzgitter',
    directions: [
      {
        label: { from: 'FH', to: 'Salzgitter-Bad' },
        from: 'de-DELFI_de:03102:2000:0:1',
        to: 'de-DELFI_de:03102:3262',
        osm: {
          from: 'https://www.openstreetmap.org/node/2498787815',
          to: 'https://www.openstreetmap.org/node/3327799174'
        }
      },
      {
        label: { from: 'Salzgitter-Bad', to: 'FH' },
        from: 'de-DELFI_de:03102:3262',
        to: 'de-DELFI_de:03102:2000:0:1',
        osm: {
          from: 'https://www.openstreetmap.org/node/3327799174',
          to: 'https://www.openstreetmap.org/node/2498787815'
        }
      },
      {
        label: { from: 'FH', to: 'Salzgitter-Lebenstedt' },
        from: 'de-DELFI_de:03102:2000:0:1',
        to: 'de-VBN_000001283137',
        osm: {
          from: 'https://www.openstreetmap.org/node/2498787815',
          to: 'https://www.openstreetmap.org/node/291906929'
        }
      },
      {
        label: { from: 'Salzgitter-Lebenstedt', to: 'FH' },
        from: 'de-VBN_000001283137',
        to: 'de-DELFI_de:03102:2000:0:1',
        osm: {
          from: 'https://www.openstreetmap.org/node/291906929',
          to: 'https://www.openstreetmap.org/node/2498787815'
        }
      }
    ]
  }
};
