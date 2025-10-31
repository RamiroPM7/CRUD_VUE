<template>
  <v-dialog :model-value="props.modelValue" persistent max-width="500px">
    <v-card>
      <v-card-title class="text-h5">{{ props.title }}</v-card-title>

      <v-card-text>{{ props.message }}</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" text @click="onCancel"> Cancelar </v-btn>
        <v-btn color="error" text @click="onConfirm"> Aceptar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// ---- 1. PROPS (Datos que entran) ----
// Definimos las props que el padre puede pasarle
const props = defineProps<{
  modelValue: boolean // Para el v-model
  title: string
  message: string
}>()

// ---- 2. EMITS (Eventos que salen) ----
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void // Para el v-model
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// ---- 3. Manejadores de Eventos ----

function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false) // Cierra el diálogo
}

function onCancel() {
  emit('cancel') // Opcional, por si el padre quiere saber
  emit('update:modelValue', false) // Cierra el diálogo
}
</script>
