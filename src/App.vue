<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title> Gestión de Clientes (Caja Morelia) </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn :to="{ name: 'client-list' }" text>
        <v-icon left>mdi-account-group</v-icon>
        Clientes
      </v-btn>
      <v-btn :to="{ name: 'client-new' }" text>
        <v-icon left>mdi-plus-box</v-icon>
        Nuevo
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// No necesitamos lógica de script aquí por ahora,
// solo estamos definiendo la plantilla visual.
</script>

<style scoped>
/* Puedes agregar estilos específicos para App.vue aquí si lo deseas */
</style>
