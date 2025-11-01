<template>
  <v-card>
    <v-card-title class="d-flex align-center pa-4">
      <span>{{ smAndDown ? 'Clientes' : 'Listado de Clientes' }}</span>

      <v-spacer></v-spacer>

      <v-btn v-if="!smAndDown" color="success" :to="{ name: 'client-new' }">
        <v-icon left>mdi-plus</v-icon>
        Nuevo Cliente
      </v-btn>

      <v-btn v-else color="success" :to="{ name: 'client-new' }" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <ClientTable :clientes="clientes" @edit="onEditClient" @delete="onDeleteClient" />
    </v-card-text>
  </v-card>

  <ConfirmDialog
    v-model="dialogVisible"
    title="Confirmar Eliminación"
    :message="dialogMessage"
    @confirm="executeDelete"
  />
</template>

<script setup lang="ts">
// Importaciones de Vue para reactividad (computed, ref)
import { computed, ref } from 'vue'
// Importación del hook de Vuetify para detectar el tamaño de la pantalla
import { useDisplay } from 'vuetify'
// Importaciones de Vuex y Vue Router
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// Importaciones de Tipos de TypeScript
import type { State } from '../stores'
import type { Cliente } from '../stores/modules/clients'

// Importación de componentes "hijos" (reutilizables)
import ClientTable from '../components/ClientTable.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

/**
 * Hook de Vuetify para la responsividad.
 * 'smAndDown' es un booleano reactivo (true/false) que detecta
 * si el tamaño de la pantalla es 'sm' (pequeño) o inferior.
 */
const { smAndDown } = useDisplay()

// Inicialización de los hooks para acceder al store y al router
const store = useStore<State>()
const router = useRouter()

/**
 * Propiedad calculada (computed) para obtener la lista de clientes desde el store.
 * Se recalculará automáticamente si el estado en Vuex cambia (ej. al eliminar).
 * Usamos 'as Cliente[]' para asegurar el tipado correcto.
 */
const clientes = computed(() => store.getters['clients/allClients'] as Cliente[])

/**
 * Manejador para el evento 'edit' emitido por ClientTable.
 * Navega a la vista de edición usando el ID del cliente.
 * @param idCliente - El ID del cliente a editar.
 */
const onEditClient = (idCliente: number) => {
  router.push({ name: 'client-edit', params: { id: idCliente } })
}

// --- Lógica del Diálogo de Confirmación ---

/** 'ref' booleano para controlar el v-model del ConfirmDialog (abierto/cerrado). */
const dialogVisible = ref(false)
/** 'ref' string para almacenar el mensaje que se mostrará en el diálogo. */
const dialogMessage = ref('')
/** 'ref' para "recordar" temporalmente el ID del cliente que se va a eliminar. */
const clientToDeleteId = ref<number | null>(null)

/**
 * Manejador para el evento 'delete' emitido por ClientTable.
 * Prepara y muestra el diálogo de confirmación.
 * @param idCliente - El ID del cliente a eliminar.
 */
const onDeleteClient = (idCliente: number) => {
  // Busca el cliente en la lista para un mensaje más amigable
  const cliente = clientes.value.find((c) => c.id === idCliente)

  // Almacena el ID para usarlo después si el usuario confirma
  clientToDeleteId.value = idCliente
  // Crea el mensaje de confirmación dinámico
  dialogMessage.value = `¿Estás seguro de que quieres eliminar al cliente "${cliente?.nombre || 'seleccionado'}"? Esta acción no se puede deshacer.`
  // Abre el diálogo
  dialogVisible.value = true
}

/**
 * Se ejecuta cuando el usuario hace clic en "Aceptar" en el ConfirmDialog.
 * Llama a la acción de Vuex para eliminar al cliente.
 */
const executeDelete = () => {
  // Doble chequeo para asegurar que tenemos un ID guardado
  if (clientToDeleteId.value !== null) {
    // Despacha la acción 'deleteClient' al store de Vuex
    store.dispatch('clients/deleteClient', clientToDeleteId.value)

    // Limpia las variables de estado
    clientToDeleteId.value = null
    dialogVisible.value = false // El diálogo también se cierra solo (vía emit)
  }
}
</script>
