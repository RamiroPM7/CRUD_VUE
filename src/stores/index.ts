// src/store/index.ts

import { createStore } from 'vuex'
import { clients } from './modules/clients' // Importa tu módulo de clientes
import type { ClientState } from './modules/clients' // Importa el tipo de estado del módulo

// ---- 1. Definición del Estado Raíz (RootState) ----

// Esta es la interfaz que 'clients.ts' estaba buscando.
// Define la forma de TODO el estado de tu aplicación.
export interface State {
  // Aquí es donde "anidamos" el estado del módulo de clientes
  clients: ClientState
}

// ---- 2. Creación del Store ----
export const store = createStore<State>({
  // Aquí le pasamos los módulos que importamos
  modules: {
    clients, // El módulo de clientes que creamos
    // aquí podrías añadir 'products', 'cart', etc.
  },
})
