<template>
  <v-card>
    <v-card-title class="d-flex align-center pa-4">
      Listado de Clientes
      <v-spacer></v-spacer>
      <v-btn color="success" :to="{ name: 'client-new' }">
        <v-icon left>mdi-plus</v-icon>
        Nuevo Cliente
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
import { computed, ref } from 'vue' // ¡NUEVO! Importamos 'ref'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { State } from '../stores'
import type { Cliente } from '../stores/modules/clients'

// Importa los componentes "tontos"
import ClientTable from '../components/ClientTable.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue' // ¡NUEVO!

// Inicializa el Store y el Router
const store = useStore<State>()
const router = useRouter()

// Obtiene los datos de Vuex (sin cambios)
const clientes = computed(() => store.getters['clients/allClients'] as Cliente[])
// Maneja el evento 'edit' (sin cambios)
const onEditClient = (idCliente: number) => {
  router.push({ name: 'client-edit', params: { id: idCliente } })
}

// ---- ¡NUEVA LÓGICA DE DIÁLOGO! ----

// 1. Estado para controlar la visibilidad del diálogo
const dialogVisible = ref(false)
// 2. Estado para el mensaje dinámico
const dialogMessage = ref('')
// 3. Estado para guardar el ID del cliente que se va a eliminar
const clientToDeleteId = ref<number | null>(null)

// 4. Actualiza 'onDeleteClient'
const onDeleteClient = (idCliente: number) => {
  // Busca el nombre del cliente para un mensaje más amigable
  const cliente = clientes.value.find((c) => c.id === idCliente)
  // Guarda el ID que queremos borrar
  clientToDeleteId.value = idCliente
  // Prepara el mensaje
  dialogMessage.value = `¿Estás seguro de que quieres eliminar al cliente "${cliente?.nombre || 'seleccionado'}"? Esta acción no se puede deshacer.`
  // Muestra el diálogo
  dialogVisible.value = true
}

// 5. Nuevo método que se ejecuta cuando el diálogo emite '@confirm'
const executeDelete = () => {
  // Solo ejecuta si tenemos un ID guardado
  if (clientToDeleteId.value !== null) {
    // Despacha la acción de Vuex
    store.dispatch('clients/deleteClient', clientToDeleteId.value)

    // Limpia el ID y cierra el diálogo (aunque el diálogo se cierra solo)
    clientToDeleteId.value = null
    dialogVisible.value = false
  }
}
// El evento '@cancel' no necesita un manejador,
// porque el diálogo se cierra solo al emitir 'update:modelValue'.
</script>
