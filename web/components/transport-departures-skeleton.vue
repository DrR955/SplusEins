<template>
  <v-card
    class="fill-height"
    outlined
    elevation="1"
  >
    <v-card-title>
      <v-skeleton-loader
        type="heading"
        class="mr-4"
        style="width: 100%;"
      />
    </v-card-title>
    <v-divider />
    <v-card-text class="py-1">
      <v-list dense>
        <div
          v-for="n in 5"
          :key="n"
          class="py-1"
        >
          <div class="mt-1">
            <v-skeleton-loader
              type="text"
              style="width: 80%"
            />
          </div>

          <div class="text-caption text--secondary mt-1">
            <v-skeleton-loader
              type="text"
              style="width: 60%"
            />
          </div>

          <div class="d-flex align-center">
            <v-skeleton-loader
              type="text"
              style="width: 110px"
            />
            <v-skeleton-loader
              type="text"
              class="ml-2"
              style="width: 90px"
            />
            <v-skeleton-loader
              type="text"
              class="ml-2"
              style="width: 70px"
            />
          </div>
        </div>
      </v-list>
    </v-card-text>
  </v-card>
</template>
