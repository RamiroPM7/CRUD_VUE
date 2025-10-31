<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="formData.nombre"
            :rules="rules.nombre"
            label="Nombre Completo"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.correo"
            :rules="rules.correo"
            label="Correo Electrónico"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.telefono"
            :rules="rules.telefono"
            label="Teléfono"
            required
            variant="outlined"
            counter="10"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col cols="auto">
          <v-btn color="grey" @click="emit('cancel')">Cancelar</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="success" type="submit" :disabled="!valid"> Guardar Cliente </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Cliente } from '../stores/modules/clients'

// Omitimos 'id' porque el formulario no debe manejarlo
type ClienteFormData = Omit<Cliente, 'id'>

// ---- 1. PROPS (Datos que entran) ----
// 'initialData' son los datos para pre-llenar el formulario (en modo edición)
const props = defineProps<{
  initialData: ClienteFormData | null
}>()

// ---- 2. EMITS (Eventos que salen) ----
const emit = defineEmits<{
  (e: 'submit', data: ClienteFormData): void // Envía los datos validados
  (e: 'cancel'): void // Avisa que se canceló
}>()

// ---- 3. ESTADO INTERNO del Formulario ----
// Le decimos a TypeScript que 'form' será un objeto con un método 'validate', o null.
const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const valid = ref(false) // Estado de validación del formulario

// 'formData' es la copia local de los datos que el usuario edita
const formData = ref<ClienteFormData>({
  nombre: '',
  correo: '',
  telefono: '',
})

// ---- 4. REGLAS DE VALIDACIÓN (Requisito del PDF) ----
const rules = {
  nombre: [(v: string) => !!v || 'El nombre es obligatorio'],
  correo: [
    (v: string) => !!v || 'El correo es obligatorio',
    (v: string) => /.+@.+\..+/.test(v) || 'El correo debe ser válido (ej. usuario@dominio.com)',
  ],
  telefono: [
    (v: string) => !!v || 'El teléfono es obligatorio',
    (v: string) => (v && v.length === 10) || 'El teléfono debe tener 10 dígitos',
    (v: string) => /^[0-9]+$/.test(v) || 'El teléfono solo debe contener números',
  ],
}

// ---- 5. LÓGICA DE SINCRONIZACIÓN ----
// Observa la prop 'initialData'. Si cambia (ej. al cargar el modo edición),
// actualiza nuestra copia local 'formData'.
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }
    } else {
      // Si no hay datos iniciales (modo crear), resetea el formulario
      formData.value = { nombre: '', correo: '', telefono: '' }
    }
  },
  { immediate: true },
) // 'immediate' ejecuta esto al cargar el componente

// ---- 6. LÓGICA DE GUARDADO ----
const onSave = async () => {
  // AÑADE ESTA GUARDIA:
  // Si la referencia al formulario aún no está lista (es null), no hagas nada.
  if (!form.value) {
    return
  }

  // Valida el formulario usando la referencia de Vuetify
  // Ahora TypeScript sabe que 'form.value' no es null aquí.
  const { valid: isValid } = await form.value.validate()

  if (isValid) {
    // Si es válido, emite el evento 'submit' con los datos
    emit('submit', formData.value)
  }
}
</script>
