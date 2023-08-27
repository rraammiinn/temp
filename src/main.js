
import PocketBase from 'pocketbase';

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

const app = createApp(App)
app.use(vuetify)

registerPlugins(app)

app.mount('#app')
