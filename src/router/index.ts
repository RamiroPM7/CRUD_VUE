// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// Importa tus vistas
import ClientList from '@/views/ClientList.vue'
import ClientForm from '@/views/ClientForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'client-list',
      component: ClientList,
    },
    {
      path: '/new',
      name: 'client-new',
      component: ClientForm,
    },
    {
      path: '/edit/:id',
      name: 'client-edit',
      component: ClientForm,
      props: true, // permite pasar el ID como prop
    },
  ],
})

export default router
