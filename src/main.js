import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import PocketBase from 'pocketbase';

// import tgMainPage from './components/tgMainPage.vue'
// import tgSettingsPage from './components/tgSettingsPage.vue'

import tgpMain from './pages/tgpMain.vue'
import tgpSettings from './pages/tgpSettings.vue'
import tgpContacts from './pages/tgpContacts.vue'
import tgpChat from './pages/tgpChat.vue'
import tgpLogIn from './pages/tgpLogIn.vue'

const pb = new PocketBase('/');

var authData
// if (! pb.authStore.isValid){
//   authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
// }

export default pb

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import './assets/style.css'


import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const routes = [
  // {name:'admin', path: '/_', redirect: '/_'},
  {name:'main', path: '/', component: tgpMain },
  {name:'login', path: '/login', component: tgpLogIn },
  {name:'chat', path: '/chat/:other', component: tgpChat, props:true },
  {name:'contacts', path: '/contacts', component: tgpContacts },
  {name:'settings', path: '/settings', component: tgpSettings },
  // {name:'catchAll', path: '/:pathMatch(.*)*', redirect: '/' },

]

const app = createApp(App)


const router = createRouter({
  scrollBehavior:(to, from, savedPosition) => {
    if (savedPosition) {
      console.log(savedPosition)
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})
app.use(router)
app.use(vuetify)

registerPlugins(app)

app.mount('#app')
