import type { Module } from 'vuex'
import type { State as RootState } from '../index' // Importaremos el tipo raíz más tarde

// ---- 1. Definición de Tipos (TypeScript) ----

// La entidad Cliente, como la pide el PDF
export interface Cliente {
  id: number
  nombre: string
  correo: string
  telefono: string
}

// Cómo lucirá el estado de ESTE módulo
export interface ClientState {
  clientes: Cliente[]
}

// Para simular el ID de la base de datos
let nextId = 1

// ---- 2. Configuración del Módulo ----

export const clients: Module<ClientState, RootState> = {
  // 'namespaced: true' es crucial para módulos.
  // Hace que este módulo sea autocontenido.
  namespaced: true,

  // ---- 3. El ESTADO (STATE) ----
  // Aquí es donde viven los datos.
  state: (): ClientState => ({
    clientes: [
      // Datos de ejemplo para simular persistencia [cite: 11]
      {
        id: nextId++,
        nombre: 'Juan Pérez (Ejemplo)',
        correo: 'juan.perez@email.com',
        telefono: '5512345678',
      },
      {
        id: nextId++,
        nombre: 'Ana Gómez (Ejemplo)',
        correo: 'ana.gomez@email.com',
        telefono: '5587654321',
      },
    ],
  }),

  // ---- 4. Las MUTACIONES (MUTATIONS) ----
  // Funciones síncronas que CAMBIAN el estado.
  mutations: {
    // C - Crear Cliente
    ADD_CLIENT(state, nuevoCliente: Omit<Cliente, 'id'>) {
      const clienteConId: Cliente = {
        id: nextId++,
        ...nuevoCliente,
      }
      state.clientes.push(clienteConId)
    },

    // U - Actualizar Cliente
    UPDATE_CLIENT(state, clienteActualizado: Cliente) {
      const index = state.clientes.findIndex((c) => c.id === clienteActualizado.id)
      if (index !== -1) {
        state.clientes[index] = clienteActualizado
      }
    },

    // D - Eliminar Cliente
    DELETE_CLIENT(state, clienteId: number) {
      state.clientes = state.clientes.filter((c) => c.id !== clienteId)
    },
  },

  // ---- 5. ACCIONES (¡NUEVO!) ----
  // Lógica de negocio. Llaman a las mutaciones usando 'commit'.
  actions: {
    // C - Crear Cliente
    // { commit } es una desestructuración del 'context' de Vuex
    createClient({ commit }, nuevoCliente: Omit<Cliente, 'id'>) {
      // Aquí iría la lógica de API (axios.post(...))
      // Como es una simulación, llamamos a la mutación directamente.
      commit('ADD_CLIENT', nuevoCliente)
    },

    // U - Actualizar Cliente
    updateClient({ commit }, clienteActualizado: Cliente) {
      commit('UPDATE_CLIENT', clienteActualizado)
    },

    // D - Eliminar Cliente
    deleteClient({ commit }, clienteId: number) {
      commit('DELETE_CLIENT', clienteId)
    },
  },

  // ---- 6. GETTERS (¡NUEVO!) ----
  // Formas de LEER el estado.
  getters: {
    // R - Leer todos los clientes
    // Devuelve el array completo para la tabla
    allClients: (state): Cliente[] => {
      return state.clientes
    },

    // R - Leer un cliente por ID
    // Devuelve un cliente específico (para el formulario de edición)
    // Devuelve una función que toma un 'id' como argumento
    getClientById:
      (state) =>
      (id: number): Cliente | undefined => {
        return state.clientes.find((c) => c.id === id)
      },
  },
}
