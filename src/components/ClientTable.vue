<template>
  <v-data-table
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
// SOLUCIÓN 3: Usamos una ruta relativa.
import type { Cliente } from '../stores/modules/clients'

// ---- 1. PROPS (Datos que entran) ----
defineProps<{
  clientes: Cliente[]
}>()

// ---- 2. EMITS (Eventos que salen) ----
const emit = defineEmits<{
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}>()

// ---- 3. Lógica de la Tabla (Headers) ----
const headers = ref([
  // SOLUCIÓN 1: Usamos 'as const' para que TypeScript
  // entienda 'align' como un tipo literal.
  { title: 'ID', key: 'id', align: 'start' as const },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Correo Electrónico', key: 'correo' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' as const },
])
</script>
