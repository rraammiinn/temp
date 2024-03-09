<template>
    <tg-main>
    <template #main><suspense><tg-channels-list-page></tg-channels-list-page></suspense></template>
    <template #appBar><tg-channels-list-app-bar></tg-channels-list-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { provide, ref } from 'vue';

    import tgMain from '../components/tgMain.vue';
    import tgChannelsListAppBar from '../components/tgChannelsListAppBar.vue';
    import tgChannelsListPage from '../components/tgChannelsListPage.vue';
    import { storeToRefs } from "pinia";
    import { useOtherStore } from "@/store/otherStore";

    const {channelSearch}=storeToRefs(useOtherStore())

    // const channelSearch=ref('')
    provide('channelSearch', channelSearch)


    </script>
    
    