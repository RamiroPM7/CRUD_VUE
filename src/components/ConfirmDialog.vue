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
/**
 * defineProps declara las propiedades que este componente reutilizable
 * acepta desde su componente padre.
 */
const props = defineProps<{
  /** * Controla si el diálogo está visible o no.
   * Es la prop estándar para implementar 'v-model'.
   */
  modelValue: boolean
  /** El texto que se mostrará en el título del modal. */
  title: string
  /** El texto que se mostrará en el cuerpo del modal. */
  message: string
}>()

/**
 * defineEmits declara los eventos personalizados que este componente
 * puede "emitir" hacia su componente padre.
 */
const emit = defineEmits<{
  /** * Evento especial para 'v-model'. Se emite para notificar al padre
   * que 'modelValue' debe cambiar (ej. a 'false' para cerrar).
   */
  (e: 'update:modelValue', value: boolean): void
  /** * Se emite cuando el usuario hace clic en el botón de confirmar ("Aceptar").
   */
  (e: 'confirm'): void
  /** * Se emite cuando el usuario hace clic en el botón de cancelar.
   */
  (e: 'cancel'): void
}>()

/**
 * Se ejecuta cuando el usuario hace clic en el botón "Aceptar".
 */
function onConfirm() {
  // Notifica al padre que la acción fue confirmada
  emit('confirm')
  // Emite el evento para cerrar el diálogo (actualiza el v-model a false)
  emit('update:modelValue', false)
}

/**
 * Se ejecuta cuando el usuario hace clic en el botón "Cancelar".
 */
function onCancel() {
  // Notifica al padre que la acción fue cancelada (opcional)
  emit('cancel')
  // Emite el evento para cerrar el diálogo (actualiza el v-model a false)
  emit('update:modelValue', false)
}
</script>
