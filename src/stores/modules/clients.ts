import type { Module } from 'vuex'
import type { State as RootState } from '../index'

/**
 * Define la forma de la entidad Cliente.
 * Cumple con los campos: Nombre, Correo Electrónico y Teléfono.
 */
export interface Cliente {
  id: number
  nombre: string
  correo: string
  telefono: string
}

/**
 * Define la forma del estado para este módulo específico.
 */
export interface ClientState {
  clientes: Cliente[]
}

// Para simular el ID de la base de datos
let nextId = 1

// ---- 2. Configuración del Módulo ----

export const clients: Module<ClientState, RootState> = {
  /**
   * 'namespaced: true' es crucial.
   * Obliga a usar el prefijo 'clients/' (ej. 'clients/createClient').
   * Esto evita colisiones si la app crece (ej. 'products/createProduct').
   */
  namespaced: true,

  // ---- 3. El ESTADO (STATE) ----
  /**
   * El estado inicial de este módulo.
   * Actúa como nuestra "base de datos" simulada.
   */
  state: (): ClientState => ({
    clientes: [
      // Datos de ejemplo para simular persistencia
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
  /**
   * Mutaciones son las ÚNICAS funciones que pueden MODIFICAR el estado.
   * Deben ser siempre síncronas.
   */
  mutations: {
    // Crea un nuevo cliente en el array de estado
    ADD_CLIENT(state, nuevoCliente: Omit<Cliente, 'id'>) {
      const clienteConId: Cliente = {
        id: nextId++,
        ...nuevoCliente,
      }
      state.clientes.push(clienteConId)
    },

    // Actualiza un cliente existente en el array
    UPDATE_CLIENT(state, clienteActualizado: Cliente) {
      const index = state.clientes.findIndex((c) => c.id === clienteActualizado.id)
      if (index !== -1) {
        state.clientes[index] = clienteActualizado
      }
    },

    //Elimina un cliente del array por su ID
    DELETE_CLIENT(state, clienteId: number) {
      state.clientes = state.clientes.filter((c) => c.id !== clienteId)
    },
  },

  /**
   * Acciones son funciones (potencialmente asíncronas) que
   * contienen la lógica de negocio (como validaciones) y llaman
   * a las mutaciones.
   */
  actions: {
    /**
     * (C) Valida y crea un nuevo cliente.
     * Lanza un error si el correo ya existe.
     */
    createClient({ commit, state }, nuevoCliente: Omit<Cliente, 'id'>) {
      // 2. Lógica de validación
      const emailExists = state.clientes.some(
        (c) => c.correo.toLowerCase() === nuevoCliente.correo.toLowerCase(),
      )

      if (emailExists) {
        // 3. Si existe, lanzamos un error que el componente 'catch'
        alert('El correo electrónico ya está en uso.')
      } else {
        // 4. Si todo está bien, guardamos
        commit('ADD_CLIENT', nuevoCliente)
      }
    },

    /**
     * Valida y actualiza un cliente.
     * Lanza un error si el correo es usado por OTRO cliente.
     */
    updateClient({ commit, state }, clienteActualizado: Cliente) {
      const emailExists = state.clientes.some(
        (c) =>
          c.correo.toLowerCase() === clienteActualizado.correo.toLowerCase() &&
          c.id !== clienteActualizado.id, // <-- La diferencia
      )

      if (emailExists) {
        // 3. Si existe, lanzamos el error
        alert('El correo electrónico ya está en uso por otro cliente.')
      } else {
        // 4. Si todo está bien, guardamos
        commit('ACTUALIZAR_CLIENTE', clienteActualizado)
      }
    },

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
