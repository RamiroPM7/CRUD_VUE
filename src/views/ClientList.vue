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
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify' // ¡NUEVO! Importar useDisplay
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// Corregí la ruta a 'stores' (si 'index.ts' está en 'src/stores')
import type { State } from '../stores'
import type { Cliente } from '../stores/modules/clients'

// Importa los componentes "tontos"
import ClientTable from '../components/ClientTable.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

// ¡NUEVO! Obtener el estado de la pantalla
const { smAndDown } = useDisplay()

// Inicializa el Store y el Router
const store = useStore<State>()
const router = useRouter()

// Obtiene los datos de Vuex (sin cambios)
const clientes = computed(() => store.getters['clients/allClients'] as Cliente[])

// Maneja el evento 'edit' (sin cambios)
const onEditClient = (idCliente: number) => {
  router.push({ name: 'client-edit', params: { id: idCliente } })
}

// ---- Lógica de Diálogo (sin cambios) ----
const dialogVisible = ref(false)
const dialogMessage = ref('')
const clientToDeleteId = ref<number | null>(null)

const onDeleteClient = (idCliente: number) => {
  const cliente = clientes.value.find((c) => c.id === idCliente)
  clientToDeleteId.value = idCliente
  dialogMessage.value = `¿Estás seguro de que quieres eliminar al cliente "${cliente?.nombre || 'seleccionado'}"? Esta acción no se puede deshacer.`
  dialogVisible.value = true
}

const executeDelete = () => {
  if (clientToDeleteId.value !== null) {
    store.dispatch('clients/deleteClient', clientToDeleteId.value)
    clientToDeleteId.value = null
    dialogVisible.value = false
  }
}
</script>
