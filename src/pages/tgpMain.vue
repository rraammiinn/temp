<template>
<tg-main>
<template #main><suspense><tg-main-page></tg-main-page></suspense></template>
<template #appBar><tg-main-app-bar></tg-main-app-bar></template>
</tg-main>
</template>

<script setup>
import { inject } from 'vue';
const isLoggedIn = inject('isLoggedIn')
if(!isLoggedIn.value)$router.push('/login')

import tgMain from '../components/tgMain.vue';
import tgMainAppBar from '../components/tgMainAppBar.vue';
import tgMainPage from '../components/tgMainPage.vue';
</script>

