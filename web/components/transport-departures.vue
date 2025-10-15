<template>
  <v-card
    class="fill-height"
    outlined
    elevation="1"
  >
    <v-card-title>
      <span class="text-h6 d-flex align-center">
        <span>
          <a
            v-if="osm && osm.from"
            :href="osm.from"
            target="_blank"
            rel="noopener"
            class="font-weight-medium"
            aria-label="Startpunkt auf OpenStreetMap anzeigen"
            title="Startpunkt auf OpenStreetMap anzeigen"
          >
            {{ label.from }}<v-icon
              small
              color="green darken-2"
              class="ml-1"
              style="vertical-align: middle;"
            >mdi-map-marker</v-icon>
          </a>
        </span>
        <span class="mx-2">→</span>
        <span>
          <a
            v-if="osm && osm.to"
            :href="osm.to"
            target="_blank"
            rel="noopener"
            class="font-weight-medium"
            aria-label="Zielpunkt auf OpenStreetMap anzeigen"
            title="Zielpunkt auf OpenStreetMap anzeigen"
          >
            {{ label.to }}<v-icon
              small
              color="red darken-2"
              class="ml-1"
              style="vertical-align: middle;"
            >mdi-map-marker</v-icon>
          </a>
        </span>
      </span>
    </v-card-title>
    <v-divider />
    <v-card-text class="py-1">
      <v-list
        dense
        v-if="departures && departures.length > 0"
      >
        <div
          v-for="(dep, idx) in departures"
          :key="idx"
          class="py-1"
        >
          <div class="d-flex">
            <div class="text-body-1">
              {{ formatTime(dep.departure) }}
              Linie: <span>{{ dep.line }}</span>
            </div>
            <v-icon
              :color="getModeColor(dep.mode)"
              class="icon ml-1 align-self-center"
              small
              role="img"
              :aria-label="getModeLabel(dep.mode)"
              :title="getModeLabel(dep.mode)"
              aria-hidden="false"
            >
              {{ getModeIcon(dep.mode) }}
            </v-icon>
            <v-chip
              v-if="dep.transfers > 0"
              x-small
              class="ml-1 align-self-center"
              color="orange"
              text-color="white"
              label
            >
              {{ dep.transfers }}× Umstieg
            </v-chip>
          </div>

          <div>
            Ziel: {{ dep.direction || '—' }}
          </div>

          <div class="text-caption text--secondary transport-meta-row">
            <span class="transport-meta-part">Abfahrt in {{ minutesUntil(dep.departure) }}</span>&nbsp;|&nbsp;
            <span class="transport-meta-part">Fahrzeit: {{ formatDuration(dep.duration) }}</span>&nbsp;|&nbsp;
            <span class="transport-meta-part">Ankunft: {{ formatTime(dep.arrival) }}</span>
          </div>
        </div>
      </v-list>

      <v-alert
        v-else
        type="info"
        dense
        outlined
        class="mb-0"
      >
        <span class="text-body-2">Keine Abfahrten verfügbar</span>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { mdiBus, mdiTrain, mdiWalk, mdiTram, mdiSubway, mdiFerry } from '@mdi/js';

dayjs.extend(duration);

export default {
  name: 'TransportDepartures',
  props: {
    label: { type: Object, required: true },
    departures: { type: Array, default: () => [] },
    osm: { type: Object, default: null }
  },
  data () {
    return {
      mdiBus,
      mdiTrain,
      mdiWalk,
      mdiTram,
      mdiSubway,
      mdiFerry
    };
  },
  methods: {
    formatTime (when) {
      return dayjs(when).format('HH:mm');
    },
    minutesUntil (when) {
      const diff = dayjs(when).diff(dayjs(), 'minute');
      if (diff <= 0) return 'unter 1 Minute';
      if (diff === 1) return '1 Minute';
      return `${diff} Minuten`;
    },
    formatDuration (ms) {
      const d = dayjs.duration(ms);
      const totalMinutes = Math.round(d.asMinutes());
      if (totalMinutes <= 0) return 'unter 1 Minute';

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const parts = [];
      if (hours > 0) parts.push(hours === 1 ? '1 Stunde' : `${hours} Stunden`);
      if (minutes > 0 || hours === 0) {
        parts.push(minutes === 1 ? '1 Minute' : `${minutes} Minuten`);
      }
      return parts.join(' ');
    },
    getModeIcon (mode) {
      switch (mode) {
        case 'bus': return this.mdiBus;
        case 'train': return this.mdiTrain;
        case 'tram': return this.mdiTram;
        case 'subway': return this.mdiSubway;
        case 'ferry': return this.mdiFerry;
        case 'walking': return this.mdiWalk;
        default: return this.mdiBus;
      }
    },
    getModeColor (mode) {
      switch (mode) {
        case 'bus': return 'blue';
        case 'train': return 'red';
        case 'tram': return 'green';
        case 'subway': return 'orange';
        case 'ferry': return 'cyan';
        case 'walking': return 'grey';
        default: return 'blue';
      }
    },
    getModeLabel (mode) {
      switch (mode) {
        case 'bus': return 'Bus';
        case 'train': return 'Zug';
        case 'tram': return 'Tram';
        case 'subway': return 'U-Bahn';
        case 'ferry': return 'Fähre';
        case 'walking': return 'Zu Fuß';
        default: return 'Verkehrsmittel';
      }
    }
  }
};
</script>

<style scoped>
.icon {
  opacity: 0.7;
}
.transport-meta-row {
  display: flex;
  flex-wrap: wrap;
}
.transport-meta-part {
  white-space: nowrap;
}
</style>
