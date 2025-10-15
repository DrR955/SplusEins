<template>
  <v-container>
    <v-card flat>
      <v-tabs
        v-model="activeTab"
        class="w-100 tabs-fullbleed"
        show-arrows="always"
      >
        <v-tab
          v-for="loc in locations"
          :key="loc.key"
          @click="setLocationAndLoad(loc.key)"
        >
          {{ loc.name }}
        </v-tab>
      </v-tabs>

      <div class="d-flex justify-center">
        <div style="max-width: 1100px; width: 100%;">
          <v-tabs-items v-model="activeTab">
            <v-tab-item
              v-for="loc in locations"
              :key="loc.key"
            >
              <template v-if="allData[loc.key]">
                <v-row
                  dense
                  class="ma-0 pa-2"
                >
                  <v-col
                    v-for="direction in loc.directions"
                    :key="loc.key + ':' + direction.label.from + ':' + direction.label.to"
                    cols="12"
                    :md="12"
                    :lg="6"
                    :xl="6"
                  >
                    <transport-departures
                      :label="direction.label"
                      :osm="direction.osm"
                      :departures="allData[loc.key].directions[direction.label.from + ' → ' + direction.label.to]"
                    />
                  </v-col>
                </v-row>

                <v-row class="ma-0 px-2 pb-2 pt-0">
                  <v-col
                    cols="12"
                    class="d-flex justify-space-between align-center"
                  >
                    <span class="caption grey--text">
                      Zuletzt aktualisiert: {{ formatUpdated(allData[loc.key].lastUpdated) }}
                    </span>
                    <span class="caption grey--text">
                      Quelle: MOTIS (<a href="https://transitous.org">Transitous</a>)
                    </span>
                  </v-col>
                </v-row>
              </template>

              <template v-else>
                <v-row
                  dense
                  class="ma-0 pa-2"
                >
                  <v-col
                    v-for="direction in (loc.directions || [])"
                    :key="loc.key + ':skeleton:' + direction.label.from + ':' + direction.label.to"
                    cols="12"
                    :md="12"
                    :lg="6"
                    :xl="6"
                  >
                    <transport-departures-skeleton />
                  </v-col>
                </v-row>

                <v-row class="ma-0 px-2 pb-2 pt-0">
                  <v-col
                    cols="12"
                    class="d-flex justify-space-between align-center"
                  >
                    <span class="caption grey--text">Lade …</span>
                    <span class="caption grey--text">
                      Quelle: MOTIS (<a href="https://transitous.org">Transitous</a>)
                    </span>
                  </v-col>
                </v-row>
              </template>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import TransportDepartures from '../components/transport-departures.vue';
import TransportDeparturesSkeleton from '../components/transport-departures-skeleton.vue';
import dayjs from 'dayjs';

dayjs.locale('de');

export default {
  name: 'TransportPage',
  components: { TransportDepartures, TransportDeparturesSkeleton },
  data () {
    return {
      activeTab: 0,
      loading: true,
      error: false
    };
  },
  computed: {
    ...mapState({
      location: (state) => state.transport.location,
      locations: (state) => state.transport.locations,
      allData: (state) => state.transport.data
    })
  },
  watch: {
    locations: {
      immediate: true,
      handler (list) {
        if (!list || list.length === 0) return;
        const idx = list.findIndex(l => l.key === this.location);
        this.activeTab = idx >= 0 ? idx : 0;
      }
    },
    activeTab (idx) {
      const loc = this.locations[idx];
      if (loc && loc.key !== this.location) {
        this.setLocationAndLoad(loc.key);
      }
    }
  },
  async mounted () {
    // 1) load tabs (locations metadata)
    await this.load();
    // 2) default tab: either current location from store, or first available location
    const defaultKey = this.locations.find(l => l.key === this.location)?.key || this.locations[0]?.key;
    if (defaultKey) {
      if (defaultKey !== this.location) this.setLocation(defaultKey);
      await this.load({ location: defaultKey });
    }
    this.loading = false;
  },
  methods: {
    ...mapActions({ load: 'transport/load' }),
    ...mapMutations({ setLocation: 'transport/setLocation' }),
    async setLocationAndLoad (key) {
      this.setLocation(key);
      if (!this.allData[key]) {
        try {
          await this.load({ location: key });
        } catch (err) {
          console.log('Error loading transport data: ', err);
        }
      }
    },
    formatUpdated (ts) {
      if (!ts) return '-';
      try {
        return dayjs(ts).format('HH:mm:ss');
      } catch (_) {
        return '-';
      }
    },
    dynamicRowStyle (directions) {
      // Card-Breite inkl. Padding (z.B. 450px), Gap (z.B. 16px)
      const cardWidth = 450;
      const gap = 16;
      const n = Object.keys(directions || {}).length || 1;
      // Maximal 4 nebeneinander, sonst wrap
      const visible = Math.min(n, 4);
      const width = visible * cardWidth + (visible - 1) * gap;
      return `width: ${width}px; min-width: ${cardWidth}px;`;
    }
  }
};
</script>

<style lang="scss">
.tabs-fullbleed .v-tabs-bar__content {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.tabs-no-prev-gap .v-slide-group__prev,
.tabs-no-prev-gap .v-slide-group__next {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tabs-no-prev-gap .v-slide-group__prev { left: 0; }
.tabs-no-prev-gap .v-slide-group__next { right: 0; }

.tabs-no-prev-gap .v-slide-group__wrapper {
  padding: 0 40px;
}

.tabs-no-prev-gap .v-slide-group__prev--disabled,
.tabs-no-prev-gap .v-slide-group__next--disabled {
  pointer-events: none;
  opacity: 0.35;
}
</style>
