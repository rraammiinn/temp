<template>
    <v-btn @click="$router.back()" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-toolbar-title>settings</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
</template>

<script setup>
import { inject, ref } from 'vue';
</script>