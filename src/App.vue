<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title> Gestión de Clientes </v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="!smAndDown">
        <v-btn :to="{ name: 'client-list' }" text>
          <v-icon left>mdi-account-group</v-icon>
          Clientes
        </v-btn>
        <v-btn :to="{ name: 'client-new' }" text>
          <v-icon left>mdi-plus-box</v-icon>
          Nuevo
        </v-btn>
      </div>

      <v-menu v-else v-model="menuOpen">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn icon v-bind="activatorProps">
            <v-fade-transition mode="out-in">
              <v-icon :key="menuOpen ? 'close' : 'menu'">
                {{ menuOpen ? 'mdi-close' : 'mdi-menu' }}
              </v-icon>
            </v-fade-transition>
          </v-btn>
        </template>

        <v-list>
          <v-list-item :to="{ name: 'client-list' }">
            <v-list-item-title>Clientes</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'client-new' }">
            <v-list-item-title>Nuevo Cliente</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Importamos 'ref' de Vue para crear variables de estado reactivas
import { ref } from 'vue'
// Importamos el hook 'useDisplay' de Vuetify para la detección de pantalla
import { useDisplay } from 'vuetify'

/**
 * Obtenemos el hook 'useDisplay'.
 * 'smAndDown' es un booleano reactivo (true/false) que nos dice si
 * la pantalla es 'sm' (pequeña) o 'xs' (extra-pequeña).
 * Controla la lógica v-if/v-else en el template.
 */
const { smAndDown } = useDisplay()

/**
 * Variable de estado reactiva para controlar si el menú móvil
 * está abierto (true) o cerrado (false).
 * Se enlaza con el 'v-model' del <v-menu>.
 */
const menuOpen = ref(false)
</script>
