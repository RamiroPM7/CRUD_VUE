// src/store/index.ts

import { createStore } from 'vuex'

// Importamos el módulo 'clients' que contiene su propio state, getters, mutations, y actions.
import { clients } from './modules/clients'
// Importamos el tipo de TypeScript que define la forma del estado del módulo 'clients'.
import type { ClientState } from './modules/clients'

/**
 * Define la interfaz del "Estado Raíz" (RootState).
 * Esta interfaz describe la forma de TODO el estado global de la aplicación.
 * Es crucial para que TypeScript entienda la estructura completa del store.
 */
export interface State {
  /**
   * Cada módulo 'namespaced' se registra como una propiedad aquí.
   * 'clients' tendrá la forma de 'ClientState'.
   */
  clients: ClientState
}

/**
 * Creamos la instancia principal del store de Vuex.
 * Le pasamos nuestro 'RootState' (<State>) para que tenga tipado estricto.
 */
export const store = createStore<State>({
  /**
   * La sección 'modules' es donde combinamos todos nuestros módulos
   * (como 'clients', 'products', 'auth', etc.) en un solo store centralizado.
   */
  modules: {
    // Registramos el módulo de clientes bajo el namespace 'clients'.
    clients,
  },
})
