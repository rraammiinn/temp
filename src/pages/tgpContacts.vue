<template>
    <tg-main>
    <template #main><suspense><tg-contacts-page></tg-contacts-page></suspense></template>
    <template #appBar><tg-contacts-app-bar></tg-contacts-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import tgMain from '../components/tgMain.vue';
    import tgContactsAppBar from '../components/tgContactsAppBar.vue';
    import tgContactsPage from '../components/tgContactsPage.vue';
    </script>
    
    