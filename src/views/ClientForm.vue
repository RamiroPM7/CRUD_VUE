<template>
  <v-card>
    <v-card-title class="pa-4">
      {{ pageTitle }}
    </v-card-title>

    <v-card-text>
      <ClientFormFields :initial-data="clienteParaEditar" @submit="onSave" @cancel="onCancel" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Importamos 'ref' y 'computed' para la reactividad
import { ref, computed } from 'vue'
// Importamos los 'hooks' para acceder al store global y al router
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// Importamos los tipos de TypeScript para nuestro store
import type { State } from '../stores'
import type { Cliente } from '../stores/modules/clients'

// Importamos el componente reutilizable del formulario
import ClientFormFields from '../components/ClientFormFields.vue'

// Creamos un tipo local para los datos del formulario (omitiendo el 'id')
type ClienteFormData = Omit<Cliente, 'id'>

// --- 1. Inicialización de Hooks ---
const store = useStore<State>() // Obtiene la instancia del store de Vuex
const router = useRouter() // Obtiene la instancia del router

// --- 2. Props de la Ruta ---
/**
 * defineProps recibe las props inyectadas por Vue Router.
 * Gracias a 'props: true' en 'router/index.ts', el ':id' de la URL
 * (ej. /edit/1) se pasa automáticamente como una prop llamada 'id'.
 * 'id?' es opcional (string | undefined) porque no existirá en la ruta '/new'.
 */
const props = defineProps<{
  id?: string
}>()

// --- 3. Lógica de Modo (Crear vs. Editar) ---

/**
 * 'ref' reactiva que almacena los datos del cliente a editar.
 * Se pasa como 'prop' a ClientFormFields para pre-llenar el formulario.
 * Comienza en 'null' para el modo "Crear".
 */
const clienteParaEditar = ref<ClienteFormData | null>(null)

/**
 * Propiedad calculada (computed) que determina el título de la página
 * basándose en si existe o no la prop 'id'.
 */
const pageTitle = computed(() => {
  return props.id ? 'Editar Cliente' : 'Crear Nuevo Cliente'
})

/**
 * Bloque de lógica principal que se ejecuta al cargar el componente.
 * Si 'props.id' existe, significa que estamos en modo "Edición".
 */
if (props.id) {
  // Convertimos el 'id' de la URL (que siempre es string) a número
  const clienteId = parseInt(props.id, 10)

  // Usamos el getter de Vuex para encontrar el cliente por su ID.
  // store.getters['...'](clienteId) llama al getter que devuelve una función.
  const clienteExistente = store.getters['clients/getClientById'](clienteId) as Cliente | undefined

  if (clienteExistente) {
    // Si encontramos al cliente, extraemos sus datos
    // Usamos desestructuración para excluir el 'id' y
    // pasar solo {nombre, correo, telefono} al formulario hijo.
    // 'id: _id' renombra 'id' a '_id' para que ESLint no marque "variable no usada".
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...data } = clienteExistente
    // Actualizamos nuestra 'ref' para pre-llenar el formulario
    clienteParaEditar.value = data
  } else {
    // Si se accede a una URL (ej. /edit/999) con un ID que no existe,
    // mostramos un error y redirigimos al listado.
    alert('Error: Cliente no encontrado')
    router.push({ name: 'client-list' })
  }
}
// Si 'props.id' no existe, 'clienteParaEditar' sigue siendo 'null',
// y ClientFormFields se renderizará como un formulario vacío (modo "Crear").

// --- 4. Manejadores de Eventos del Formulario Hijo ---

/**
 * Se ejecuta cuando el componente hijo 'ClientFormFields' emite el evento '@submit'.
 * @param formData - Los datos validados provenientes del formulario hijo.
 */
const onSave = (formData: ClienteFormData) => {
  /**
   * Usamos try...catch para manejar cualquier error lanzado por las
   * acciones de Vuex (ej. validación de email duplicado).
   */
  try {
    if (props.id) {
      // MODO EDICIÓN:
      // Reconstruimos el objeto Cliente completo (incluyendo el ID)
      const clienteActualizado: Cliente = {
        id: parseInt(props.id, 10),
        ...formData,
      }
      // Despachamos la acción de Vuex para actualizar
      store.dispatch('clients/updateClient', clienteActualizado)
      alert('Cliente actualizado con éxito') // TODO: Reemplazar con modal
    } else {
      // MODO CREACIÓN:
      // Despachamos la acción de Vuex para crear
      store.dispatch('clients/createClient', formData)
      // (El alert('Cliente creado...') se omite porque el 'try' tiene éxito)
    }

    // Si el 'try' tiene éxito (no hubo errores), regresa a la lista.
    router.push({ name: 'client-list' })
  } catch (error) {
    // Si store.dispatch lanza un error (ej. email duplicado),
    // el 'catch' lo captura y muestra el mensaje.
    console.error('Error al guardar el cliente:', error)
    // Mostramos el mensaje de error que vino desde la acción de Vuex
    alert(`Error: ${(error as Error).message || 'No se pudo guardar el cliente.'}`)
  }
}

/**
 * Se ejecuta cuando el componente hijo 'ClientFormFields' emite el evento '@cancel'.
 */
const onCancel = () => {
  // Simplemente navega de vuelta a la lista de clientes.
  router.push({ name: 'client-list' })
}
</script>
