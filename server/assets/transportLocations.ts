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
        name: 'FH → Am Exer',
        from: 'de-DELFI_de:03158:598:0:1', // FH Wolfenbüttel
        to: 'de-DELFI_de:03158:599:0:1' // Am Exer Süd
      },
      {
        name: 'Am Exer → FH',
        from: 'de-DELFI_de:03158:599:0:1', // Am Exer Süd
        to: 'de-DELFI_de:03158:598:0:1' // FH Wolfenbüttel
      }
    ]
  },
  wob: {
    name: 'Wolfsburg',
    directions: [
      {
        name: 'Wolfsburg Imperial (FH) → Hauptbahnhof',
        from: 'de-DELFI_de:03103:567:0:1', // FH Wolfsburg
        to: 'de-DELFI_de:03103:2015' // Wolfsburg Hbf
      },
      {
        name: 'Hauptbahnhof → Wolfsburg Imperial (FH)',
        from: 'de-DELFI_de:03103:2015', // Wolfsburg Hbf
        to: 'de-DELFI_de:03103:567:0:1' // FH Wolfsburg
      }
    ]
  },
  sud: {
    name: 'Suderburg',
    directions: [
      {
        name: 'Suderburg Bahnhof → Uelzen Bahnhof',
        from: 'de-VBN_000000817700', // Bahnhof Suderburg
        to: 'de-DELFI_de:03360:92160' // Uelzen Bahnhof
      },
      {
        name: 'Uelzen Bahnhof → Suderburg Bahnhof',
        from: 'de-DELFI_de:03360:92160', // Uelzen Bahnhof
        to: 'de-VBN_000000817700' // Bahnhof Suderburg
      }
    ]
  },
  sz: {
    name: 'Salzgitter',
    directions: [
      {
        name: 'FH → Salzgitter-Bad',
        from: 'de-DELFI_de:03102:2000:0:1', // FH Salzgitter
        to: 'de-DELFI_de:03102:3262' // Salzgitter-Bad Bf
      },
      {
        name: 'Salzgitter-Bad → FH',
        from: 'de-DELFI_de:03102:3262', // Salzgitter-Bad Bf
        to: 'de-DELFI_de:03102:2000:0:1' // FH Salzgitter
      },
      {
        name: 'FH → Salzgitter-Lebenstedt',
        from: 'de-DELFI_de:03102:2000:0:1', // FH Salzgitter
        to: 'de-DELFI_de:03102:3137' // Salzgitter-Lebenstedt Bf
      },
      {
        name: 'Salzgitter-Lebenstedt → FH',
        from: 'de-DELFI_de:03102:3137', // Salzgitter-Lebenstedt Bf
        to: 'de-DELFI_de:03102:2000:0:1' // FH Salzgitter
      }
    ]
  }
};
