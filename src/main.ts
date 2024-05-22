import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'

import router from '@/router'
import { store, key } from '@/store'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives
})

createApp(App)
    .use(router)
    .use(store, key)
    .use(vuetify)
    .mount('#app')
    .$nextTick(() => setTimeout(() => window.electronApi.setWindowVisibility(true), 700))
