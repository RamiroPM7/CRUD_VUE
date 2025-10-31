<template>
  <v-data-table
    v-if="!smAndDown"
    :headers="headers"
    :items="clientes"
    :items-per-page="5"
    class="elevation-1"
    item-key="id"
  >
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn icon size="small" color="primary" class="mr-2" @click="emit('edit', item.id)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" color="error" @click="emit('delete', item.id)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>

  <v-list v-else lines="three">
    <v-list-item v-for="item in clientes" :key="item.id" :title="item.nombre">
      <v-list-item-subtitle>{{ item.correo }}</v-list-item-subtitle>
      <v-list-item-subtitle>{{ item.telefono }}</v-list-item-subtitle>

      <template v-slot:append>
        <v-btn icon variant="text" color="primary" @click="emit('edit', item.id)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon variant="text" color="error" @click="emit('delete', item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
// 1. Importamos 'ref' Y 'useDisplay'
import { ref } from 'vue'
import { useDisplay } from 'vuetify' // ¡NUEVO! Importa el hook de display
import type { Cliente } from '../stores/modules/clients'

// 2. Obtenemos el estado de la pantalla
// 'smAndDown' es un booleano reactivo (true si es móvil, false si no)
const { smAndDown } = useDisplay()

// ---- PROPS (Sin cambios) ----
defineProps<{
  clientes: Cliente[]
}>()

// ---- EMITS (Sin cambios) ----
// ¡Importante! Los emits son los mismos para la tabla y la lista
const emit = defineEmits<{
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}>()

// ---- Headers de la Tabla (Sin cambios) ----
// (Estos solo se usan para la v-data-table)
const headers = ref([
  { title: 'ID', key: 'id', align: 'start' as const },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Correo Electrónico', key: 'correo' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' as const },
])
</script>
