<template>
    <tg-main>
    <template #main><suspense><tg-groups-list-page></tg-groups-list-page></suspense></template>
    <template #appBar><tg-groups-list-app-bar></tg-groups-list-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { provide, ref } from 'vue';

    import tgMain from '../components/tgMain.vue';
    import tgGroupsListAppBar from '../components/tgGroupsListAppBar.vue';
    import tgGroupsListPage from '../components/tgGroupsListPage.vue';

    const groupSearch=ref('')
    provide('groupSearch', groupSearch)


    </script>
    
    