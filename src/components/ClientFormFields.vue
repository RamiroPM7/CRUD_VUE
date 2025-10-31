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
import { Form, Field } from 'vee-validate'
import type { Cliente } from '../stores/modules/clients'

type ClienteFormData = Omit<Cliente, 'id'>

// ---- 1. PROPS (Sin cambios) ----
const props = defineProps<{
  initialData: ClienteFormData | null
}>()

// ---- 2. EMITS (Sin cambios) ----
const emit = defineEmits<{
  (e: 'submit', data: ClienteFormData): void
  (e: 'cancel'): void
}>()

// ---- 3. LÓGICA DE GUARDADO (onSubmit) ----
// SOLUCIÓN 1: Reemplazamos 'any' por un tipo más específico.
const onSubmit = (values: Record<string, unknown>) => {
  // Emitimos los datos casteados a nuestro tipo
  emit('submit', values as ClienteFormData)
}

// ---- 4. REGLAS DE VALIDACIÓN (Movidas a funciones) ----
// SOLUCIÓN 2: Todas las reglas ahora aceptan 'v: unknown'
// y luego lo convertimos a string de forma segura.

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

function validateNombre(v: unknown) {
  const value = String(v || '').trim() // Conversión segura
  return !!value || 'El nombre es obligatorio'
}

function validateEmail(v: unknown) {
  const email = String(v || '')
    .trim()
    .toLowerCase() // Conversión segura
  if (!email) return 'El correo es obligatorio'

  const re =
    /^(?!.*\.\.)(?=.{1,254}$)[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@(?:[A-Za-z0-9-]+\.)+([A-Za-z]{2,24})$/
  const m = email.match(re)
  if (!m || typeof m[1] !== 'string') return 'El formato del correo no es válido'
  const tld = m[1]
  if (!COMMON_TLDS.has(tld)) return 'El formato del correo no es válido'

  return true
}

function validateTelefono(v: unknown) {
  const value = String(v || '').trim() // Conversión segura
  if (!value) return 'El teléfono es obligatorio'
  if (value.length !== 10) return 'El teléfono debe tener 10 dígitos'
  if (!/^[0-9]+$/.test(value)) return 'El teléfono solo debe contener números'
  return true
}
</script>
