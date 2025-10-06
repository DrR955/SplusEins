<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card
      flat
      :loading="loading"
    >
      <v-alert
        v-if="error"
        type="error"
        dense
        outlined
        class="ma-2"
      >
        Fehler beim Laden der ÖPNV-Daten. Bitte später erneut versuchen.
      </v-alert>

      <v-tabs
        v-model="activeTab"
        class="w-100 tabs-no-prev-gap tabs-fullbleed"
      >
        <v-tab
          v-for="loc in locations"
          :key="loc.key"
          @click="setLocation(loc.key)"
        >
          {{ loc.name }}
        </v-tab>
      </v-tabs>

      <v-alert
        v-if="loading && !hasCache"
        type="info"
        dense
        outlined
        class="ma-2"
      >
        Aktuelle Verkehrsdaten werden abgefragt – dies kann einen Moment dauern.
      </v-alert>

      <v-container
        v-if="loading"
        class="pa-4"
      >
        <v-row class="justify-center">
          <v-col
            v-for="n in 2"
            :key="'skl-'+n"
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="3"
            class="pa-2 d-flex"
          >
            <transport-departures-skeleton class="flex-grow-1" />
          </v-col>
        </v-row>
      </v-container>

      <v-tabs-items
        v-else
        v-model="activeTab"
      >
        <v-tab-item
          v-for="loc in locations"
          :key="loc.key"
        >
          <v-container class="pa-4">
            <v-row class="justify-center">
              <v-col
                v-for="(departures, directionName) in allData[loc.key].directions"
                :key="directionName"
                cols="12"
                sm="12"
                md="6"
                lg="6"
                xl="3"
                class="pa-2 d-flex"
              >
                <transport-departures
                  class="flex-grow-1"
                  :title="directionName"
                  :departures="departures"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>

      <div class="px-4">
        <span class="pt-4 d-flex justify-end text-caption text--secondary">
          Quelle:&nbsp;
          <a
            href="https://transitous.org/"
            class="link"
          >Transitous</a>
        </span>
        <span
          v-if="!loading && lastUpdated"
          class="d-flex justify-end text-caption text--secondary"
        >
          Zuletzt aktualisiert:
          {{ $dayjs(lastUpdated).format('HH:mm:ss') }} Uhr
        </span>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import TransportDepartures from '../components/transport-departures.vue';
import TransportDeparturesSkeleton from '../components/transport-departures-skeleton.vue';

export default {
  name: 'TransportPage',
  components: { TransportDepartures, TransportDeparturesSkeleton },
  head () {
    return {
      title: 'ÖPNV',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Öffentlicher Personennahverkehr - Abfahrtszeiten für alle Ostfalia-Standorte'
        }
      ]
    };
  },
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
      allData: (state) => state.transport.data,
      lastUpdated: (state) => state.transport.lastUpdated
    }),
    hasCache () {
      return !!this.lastUpdated && this.allData && Object.keys(this.allData).length > 0;
    }
  },
  async mounted () {
    this.startLoading();
    try {
      await this.load();
      this.loading = false;
      this.error = false;
    } catch (err) {
      this.loading = false;
      this.error = true;
      console.log('Error loading transport data: ', err);
    }
  },
  methods: {
    ...mapActions({
      load: 'transport/load'
    }),
    ...mapMutations({
      setLocation: 'transport/setLocation'
    }),
    startLoading () {
      this.loading = true;
      this.error = false;
    }
  },
  middleware: 'cached'
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
