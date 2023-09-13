<template>
<tg-main>
<template #main><suspense><tg-settings-page></tg-settings-page></suspense></template>
<template #appBar><tg-settings-app-bar></tg-settings-app-bar></template>
</tg-main>
</template>

<script setup>
import tgMain from '../components/tgMain.vue';
import tgSettingsAppBar from '../components/tgSettingsAppBar.vue';
import tgSettingsPage from '../components/tgSettingsPage.vue';
</script>
