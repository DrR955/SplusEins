export const state = () => ({
  location: process.client ? (localStorage.getItem('transportLocation') || 'wf') : 'wf',
  locations: [],
  data: {},
  lastUpdated: null
});

export const mutations = {
  setLocation (state, location) {
    state.location = location;
    if (process.client) {
      localStorage.setItem('transportLocation', location);
    }
  },
  setAllData (state, payload) {
    state.locations = payload.locations;
    state.data = payload.data;
    state.lastUpdated = payload.lastUpdated;
  }
};

export const getters = {
  currentLocationData: (state) => state.data[state.location] || null,
  availableLocations: (state) => state.locations,
  currentLocationKey: (state) => state.location,
  allData: (state) => state.data
};

export const actions = {
  async load ({ commit }) {
    try {
      const response = await this.$axios.get('/api/transport');
      commit('setAllData', {
        locations: response.data.locations,
        data: response.data.data,
        lastUpdated: response.data.lastUpdated
      });
    } catch (error) {
      console.error('Fehler beim Laden der Transport-Daten:', error);
      commit('enqueueError', 'ÖPNV-Daten konnten nicht geladen werden.', { root: true });
      throw error;
    }
  }
};
