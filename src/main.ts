import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// El store lo configuraremos en el siguiente paso, pero lo dejamos listo
import { store } from './stores'

// --- Importaciones de Vuetify ---
import 'vuetify/styles' // Importa los estilos CSS de Vuetify
import { createVuetify } from 'vuetify' // El creador de Vuetify
import * as components from 'vuetify/components' // Todos los componentes (v-btn, v-card, etc.)
import * as directives from 'vuetify/directives' // Directivas (v-tooltip, etc.)
import '@mdi/font/css/materialdesignicons.css' // Importa los iconos de Material Design

// --- 1. IMPORTA LAS HERRAMIENTAS ---
import { defineRule } from 'vee-validate'
import { required, email, length, numeric } from '@vee-validate/rules'

// --- 2. DEFINE LAS REGLAS QUE USARÁS ---
// Esto le "enseña" a VeeValidate qué significan esos strings
defineRule('required', required) // Regla 'required'
defineRule('email', email) // Regla 'email'
defineRule('length', length) // Regla 'length' (para el teléfono)
defineRule('numeric', numeric) // Regla 'numeric' (para el teléfono)

// --- Creación de la instancia de Vuetify ---
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // Configura MDI como el set de iconos por defecto
  },
})
// ------------------------------------

const app = createApp(App)

app.use(router) // Usa el Router
app.use(vuetify) // Usa Vuetify
app.use(store) // Usará el Store (siguiente paso)

app.mount('#app')
