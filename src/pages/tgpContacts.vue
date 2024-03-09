<template>
    <tg-main>
    <template #main><suspense><tg-contacts-page></tg-contacts-page></suspense></template>
    <template #appBar><tg-contacts-app-bar></tg-contacts-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { provide, ref } from 'vue';

    import tgMain from '../components/tgMain.vue';
    import tgContactsAppBar from '../components/tgContactsAppBar.vue';
    import tgContactsPage from '../components/tgContactsPage.vue';
    import { storeToRefs } from "pinia";
    import { useOtherStore } from "@/store/otherStore";

    const {userSearch}=storeToRefs(useOtherStore())
    // const userSearch=ref('')
    provide('userSearch', userSearch)


    </script>
    
    