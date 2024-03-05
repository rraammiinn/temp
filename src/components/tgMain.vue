<template>

        <v-card>
      <v-layout>
        <v-app-bar prominent style="position: fixed;">
          <slot name="appBar"></slot>
        </v-app-bar>
  
        <v-navigation-drawer
          v-model="drawer"
          location="left"
          temporary
          style="position: fixed;height: 100%;padding-bottom: 3rem;"
        >
          <v-list>
            <slot name="sideBarItems"><tg-side-bar-items></tg-side-bar-items></slot>
        </v-list>
        </v-navigation-drawer>
  
        <v-main style="height: 100dvh;overflow:auto;">
          <slot name="main"></slot>
        </v-main>
      </v-layout>
    </v-card>

  </template>
  
  <script setup>
    import { inject } from 'vue';

    import tgSideBarItems from './tgSideBarItems.vue';

    const drawer=inject('drawer')
  </script>
  
