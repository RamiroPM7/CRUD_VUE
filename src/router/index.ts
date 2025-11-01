// src/router/index.ts

// Importamos las funciones necesarias de vue-router
// createRouter: La función principal para crear la instancia del router.
// createWebHistory: Habilita el modo de historial HTML5 (URLs limpias, sin '#').
import { createRouter, createWebHistory } from 'vue-router'

// Importamos los componentes de "Vista" (páginas) que el router renderizará
import ClientList from '@/views/ClientList.vue'
import ClientForm from '@/views/ClientForm.vue'

// Creamos la instancia principal del router
const router = createRouter({
  /**
   * Define el modo de historial.
   * 'createWebHistory' usa la History API nativa del navegador.
   * 'import.meta.env.BASE_URL' es para configurar la URL base,
   * crucial para el despliegue en subcarpetas (como GitHub Pages).
   */
  history: createWebHistory(import.meta.env.BASE_URL),

  /**
   * Array que define todas las rutas de la aplicación.
   */
  routes: [
    {
      /** Ruta raíz de la aplicación (ej. http://localhost:5173/) */
      path: '/',
      /** Nombre único para esta ruta (útil para <router-link>) */
      name: 'client-list',
      /** Componente de Vue que se renderizará en esta ruta */
      component: ClientList,
    },
    {
      /** Ruta para el formulario de 'Alta de Cliente' */
      path: '/new',
      name: 'client-new',
      /** Reutilizamos el mismo componente de formulario */
      component: ClientForm,
    },
    {
      /**
       * Ruta para 'Edición de Cliente'.
       * ':id' es un parámetro dinámico, capturará (ej. /edit/1, /edit/2)
       */
      path: '/edit/:id',
      name: 'client-edit',
      component: ClientForm, // Reutiliza el mismo componente
      /**
       * ¡Importante! 'props: true' le dice a Vue Router que pase
       * automáticamente el parámetro ':id' de la URL como una 'prop'
       * al componente 'ClientForm.vue'.
       */
      props: true,
    },
  ],
})

// Exportamos la instancia del router para ser usada en 'main.ts'
export default router
