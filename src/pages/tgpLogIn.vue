<template>
    <tg-main>
    <template #main><suspense><tg-log-in-page></tg-log-in-page></suspense></template>
    </tg-main>
    </template>
    
    <script setup>
    import tgMain from '../components/tgMain.vue';
    import tgLogInPage from '../components/tgLogInPage.vue';
    </script>
    
    