<template>
  <Form
    @submit="onSubmit"
    :initial-values="props.initialData || undefined"
    :enable-reinitialize="true"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <Field name="nombre" :rules="validateNombre" v-slot="{ field, errors }">
            <v-text-field
              v-bind="field"
              :error-messages="errors"
              label="Nombre Completo"
              required
              variant="outlined"
            ></v-text-field>
          </Field>
        </v-col>

        <v-col cols="12" md="6">
          <Field name="correo" :rules="validateEmail" v-slot="{ field, errors }">
            <v-text-field
              v-bind="field"
              :error-messages="errors"
              label="Correo Electrónico"
              required
              variant="outlined"
            ></v-text-field>
          </Field>
        </v-col>

        <v-col cols="12" md="6">
          <Field name="telefono" :rules="validateTelefono" v-slot="{ field, errors }">
            <v-text-field
              v-bind="field"
              :error-messages="errors"
              label="Teléfono"
              required
              variant="outlined"
              counter="10"
            ></v-text-field>
          </Field>
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col cols="auto">
          <v-btn color="grey" @click="emit('cancel')">Cancelar</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="success" type="submit"> Guardar Cliente </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </Form>
</template>

<script setup lang="ts">
// Importamos los componentes <Form> y <Field> de VeeValidate
import { Form, Field } from 'vee-validate'
// Importamos nuestra interfaz de Cliente para tipado
import type { Cliente } from '../stores/modules/clients'

// Definimos un tipo local para los datos del formulario (sin el 'id')
type ClienteFormData = Omit<Cliente, 'id'>

/**
 * defineProps recibe los datos iniciales del componente padre.
 * 'initialData' será un objeto Cliente (en modo edición) o 'null' (en modo creación).
 */
const props = defineProps<{
  initialData: ClienteFormData | null
}>()

/**
 * defineEmits declara los eventos que este componente "hijo" puede
 * enviar al componente "padre" (ClientForm.vue).
 */
const emit = defineEmits<{
  (e: 'submit', data: ClienteFormData): void // Se emite al guardar (con los datos)
  (e: 'cancel'): void // Se emite al cancelar
}>()

/**
 * Función que maneja el evento @submit del <Form>.
 * VeeValidate solo llama a esta función si TODAS las reglas de validación
 * han pasado con éxito.
 * @param values - Un objeto que contiene los datos validados del formulario.
 */
const onSubmit = (values: Record<string, unknown>) => {
  // Emitimos el evento 'submit' hacia el padre, enviando los datos limpios.
  emit('submit', values as ClienteFormData)
}

/**
 * Lista blanca de Dominios de Nivel Superior (TLDs) comunes
 * para nuestra validación de email personalizada.
 */
const COMMON_TLDS = new Set([
  'com',
  'net',
  'org',
  'io',
  'es',
  'mx',
  'co',
  'dev',
  'gov',
  'edu',
  'info',
  'biz',
  'online',
  'app',
  'site',
  'tech',
])

/**
 * Regla de validación para el campo 'nombre'.
 * @param v - El valor del campo (tipo 'unknown' por VeeValidate).
 */
function validateNombre(v: unknown) {
  // Convertimos 'unknown' a 'string' de forma segura
  const value = String(v || '').trim()
  return !!value || 'El nombre es obligatorio'
}

/**
 * Regla de validación personalizada y estricta para el 'correo'.
 * @param v - El valor del campo (tipo 'unknown').
 */
function validateEmail(v: unknown) {
  // 1. Limpiamos el valor de entrada
  const email = String(v || '')
    .trim()
    .toLowerCase()
  if (!email) return 'El correo es obligatorio'

  // 2. Regex estricta que incluye anclaje al final ($)
  const re =
    /^(?!.*\.\.)(?=.{1,254}$)[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@(?:[A-Za-z0-9-]+\.)+([A-Za-z]{2,24})$/

  // 3. Validamos el formato
  const m = email.match(re)
  if (!m || typeof m[1] !== 'string') return 'El formato del correo no es válido'

  // 4. Validamos el TLD contra nuestra lista blanca
  const tld = m[1]
  if (!COMMON_TLDS.has(tld)) return 'El formato del correo no es válido'

  // Si todo pasa, es válido
  return true
}

/**
 * Regla de validación para el campo 'telefono'.
 * @param v - El valor del campo (tipo 'unknown').
 */
function validateTelefono(v: unknown) {
  // Convertimos 'unknown' a 'string' de forma segura
  const value = String(v || '').trim()
  if (!value) return 'El teléfono es obligatorio'
  if (value.length !== 10) return 'El teléfono debe tener 10 dígitos'
  if (!/^[0-9]+$/.test(value)) return 'El teléfono solo debe contener números'
  return true
}
</script>
