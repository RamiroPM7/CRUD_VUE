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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { State } from '../stores' // Importa el RootState
import type { Cliente } from '../stores/modules/clients' // Importa la interfaz

// Importa el componente "tonto"
import ClientFormFields from '../components/ClientFormFields.vue'

// Omitimos 'id' porque el formulario nos da los datos sin él
type ClienteFormData = Omit<Cliente, 'id'>

// ---- 1. Configuración (Store, Router) ----
const store = useStore<State>()
const router = useRouter()

// ---- 2. Props (Datos de la Ruta) ----
// Obtenemos el 'id' de la URL (gracias a 'props: true' en el router)
const props = defineProps<{
  id?: string // Es 'string' porque viene de la URL. Será 'undefined' si es /new
}>()

// ---- 3. Lógica de "Modo Edición" vs "Modo Creación" ----

// Variable reactiva para guardar los datos del cliente a editar
const clienteParaEditar = ref<ClienteFormData | null>(null)

// Título dinámico
const pageTitle = computed(() => {
  return props.id ? 'Editar Cliente' : 'Crear Nuevo Cliente'
})

// Lógica principal:
// Si la prop 'id' existe, estamos en modo EDICIÓN
if (props.id) {
  // Convertimos el id de string a number
  const clienteId = parseInt(props.id, 10)

  // Usamos el getter de Vuex para encontrar el cliente
  // Nota: store.getters['...'](id) es como llamamos a un getter que devuelve una función
  const clienteExistente = store.getters['clients/getClientById'](clienteId) as Cliente | undefined

  if (clienteExistente) {
    // Si lo encontramos, lo ponemos en nuestra ref
    // (Omitimos el 'id' ya que el formulario no lo necesita)
    // Renombramos 'id' a '_id' para indicar que no se usará
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...data } = clienteExistente
    clienteParaEditar.value = data
  } else {
    // Manejo de error (si el ID no existe, ej. /edit/999)
    alert('Error: Cliente no encontrado')
    router.push({ name: 'client-list' })
  }
}
// Si 'props.id' no existe, 'clienteParaEditar' se queda en 'null',
// y el formulario se mostrará vacío (Modo CREACIÓN).

// ---- 4. Manejo de Eventos del Formulario ----

// Se llama cuando el formulario hijo emite '@submit'
const onSave = (formData: ClienteFormData) => {
  try {
    if (props.id) {
      // MODO EDICIÓN: Despacha la acción 'updateClient'
      const clienteActualizado: Cliente = {
        id: parseInt(props.id, 10), // Añadimos el ID de vuelta
        ...formData,
      }
      store.dispatch('clients/updateClient', clienteActualizado)
      alert('Cliente actualizado con éxito')
    } else {
      // MODO CREACIÓN: Despacha la acción 'createClient'
      store.dispatch('clients/createClient', formData)
      alert('Cliente creado con éxito')
    }

    // Después de guardar, regresa a la lista
    router.push({ name: 'client-list' })
  } catch (error) {
    // Requisito: Manejo de Errores
    console.error('Error al guardar el cliente:', error)
    alert('Error: No se pudo guardar el cliente. Ver la consola.')
  }
}

// Se llama cuando el formulario hijo emite '@cancel'
const onCancel = () => {
  // Simplemente regresa a la lista
  router.push({ name: 'client-list' })
}
</script>
