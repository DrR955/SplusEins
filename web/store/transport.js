export const state = () => ({
  // TODO: später aus FH-Standort-Auswahl ableiten
  location: process.client ? (localStorage.getItem('transportLocation') || 'wf') : 'wf',
  locations: [],
  data: {},
  lastUpdated: null,
  ttlSeconds: null
});

export const mutations = {
  setLocation (state, location) {
    state.location = location;
    if (process.client) localStorage.setItem('transportLocation', location);
  },
  setLocations (state, locations) {
    state.locations = locations || [];
  },
  setLocationData (state, { locationKey, locationData, lastUpdated }) {
    state.data = { ...state.data, [locationKey]: locationData };
    state.lastUpdated = lastUpdated;
  },
  setTtlSeconds (state, ttl) {
    state.ttlSeconds = typeof ttl === 'number' ? ttl : null;
  }
};

export const getters = {
  currentLocationData: (state) => state.data[state.location] || null,
  availableLocations: (state) => state.locations,
  currentLocationKey: (state) => state.location,
  allData: (state) => state.data,
  ttlSeconds: (state) => state.ttlSeconds
};

export const actions = {
  // load only metadata (tabs) if no location is given, else load metadata + data for the requested location
  async load ({ commit }, { location } = {}) {
    try {
      const response = await this.$axios.get('/api/transport', {
        params: location ? { location } : undefined
      });

      if (response.data.locations) {
        commit('setLocations', response.data.locations);
      }
      commit('setTtlSeconds', response.data.ttlSeconds);

      if (location && response.data.data) {
        const key = Object.keys(response.data.data)[0];
        const locData = response.data.data[key];
        if (locData) {
          commit('setLocationData', {
            locationKey: key,
            locationData: locData,
            lastUpdated: response.data.lastUpdated
          });
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden der Transport-Daten:', error);
      commit('enqueueError', 'ÖPNV-Daten konnten nicht geladen werden.', { root: true });
      throw error;
    }
  }
};
