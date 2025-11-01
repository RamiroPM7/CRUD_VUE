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
// Importamos 'ref' para crear variables reactivas (headers)
import { ref } from 'vue'
// Importamos el hook de Vuetify para detectar el tamaño de la pantalla
import { useDisplay } from 'vuetify'
// Importamos la interfaz de 'Cliente' para el tipado de las props
import type { Cliente } from '../stores/modules/clients'

/**
 * Obtenemos el hook 'useDisplay' de Vuetify.
 * 'smAndDown' es un booleano reactivo que será 'true' si el viewport
 * es 'sm' (pequeño) o 'xs' (extra-pequeño), y 'false' en caso contrario.
 * Esta es la variable que controla qué vista se muestra en el template.
 */
const { smAndDown } = useDisplay()

/**
 * defineProps declara los datos que este componente "hijo" (dumb)
 * recibe de su componente "padre" (smart).
 * @param clientes - El array de clientes que se va a renderizar.
 */
defineProps<{
  clientes: Cliente[]
}>()

/**
 * defineEmits declara los eventos que este componente puede "emitir" al padre.
 * Este componente no tiene lógica de negocio; solo notifica al padre
 * sobre las interacciones del usuario.
 */
const emit = defineEmits<{
  (e: 'edit', id: number): void // Evento al hacer clic en 'editar'
  (e: 'delete', id: number): void // Evento al hacer clic en 'eliminar'
}>()

/**
 * Definición de las columnas (cabeceras) para el componente <v-data-table>.
 * Esto solo se utiliza en la vista de escritorio.
 * 'as const' es un truco de TypeScript para que 'align: "start"'
 * sea tratado como un tipo literal y no como un 'string' genérico.
 */
const headers = ref([
  { title: 'ID', key: 'id', align: 'start' as const },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Correo Electrónico', key: 'correo' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' as const },
])
</script>
