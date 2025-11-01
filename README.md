# Prueba Técnica: Programador FULL STACK (Ejercicio 1 - Frontend)

Evaluación para **Caja Morelia Valladolid**.

Este repositorio contiene la solución al **Ejercicio 1 (Frontend)** de la prueba técnica. Es una Single Page Application (SPA) desarrollada con **Vue 3 (Composition API)** para la gestión de clientes, cumpliendo con los siguientes requisitos clave:

- **Gestión de Estado:** Simulación de persistencia de datos con **Vuex**.
- **Enrutamiento:** Navegación entre vistas (Listado, Alta, Edición) con **Vue Router**.
- **Interfaz Gráfica:** Diseño responsivo construido con **Vuetify 3**.
- **Validación:** Manejo avanzado de formularios con **VeeValidate**.

## 🚀 Instrucciones de Ejecución

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

### 1\. Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18+ recomendada)

### 2\. Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/RamiroPM7/CRUD_VUE.git
    ```
2.  Navega a la carpeta del proyecto:
    ```bash
    cd CRUD_VUE
    ```
3.  Instala las dependencias de NPM:
    ```bash
    npm install
    ```

### 3\. Ejecución

1.  Ejecuta el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```
2.  Abre tu navegador y visita `http://localhost:5173/` (o el puerto que indique la terminal).

### 4\. Probar en Dispositivos Móviles (Responsivo)

Para probar la aplicación en tu celular (conectado a la misma red Wi-Fi):

```bash
# Ejecuta el servidor en modo "host" para exponerlo a tu red local
npm run dev -- --host
```

---

## 🧠 Proceso de Desarrollo y Decisiones Técnicas

Este proyecto se construyó siguiendo un enfoque modular y profesional.

### 1\. Arquitectura del Proyecto

Para cumplir con la "separación de la lógica y la presentación", se implementó una arquitectura de "Vistas Inteligentes" y "Componentes Tontos":

- **Vistas Inteligentes (`/src/views`):**
  - `ClientList.vue`: Es el "cerebro" del listado. Se comunica con Vuex para obtener datos y con Vue Router para navegar. Orquesta los componentes `ClientTable` y `ConfirmDialog`.
  - `ClientForm.vue`: Es el "cerebro" del formulario. Detecta si está en modo "Crear" o "Editar" (leyendo la `prop` `:id` del router), carga datos de Vuex si es necesario y despacha las acciones de guardado.

- **Componentes Tontos (`/src/components`):**
  - `ClientTable.vue`: Es un componente de presentación. Solo recibe `props` (la lista de clientes) y emite eventos (`@edit`, `@delete`). No sabe nada de Vuex.
  - `ClientFormFields.vue`: Componente reutilizable que contiene la lógica pura del formulario (campos y validación). No sabe si está creando o editando, solo emite `@submit` con los datos validados.
  - `ConfirmDialog.vue`: Un modal de confirmación genérico y reutilizable.

### 2\. Gestión de Estado (Vuex)

El _store_ (`/src/stores/modules/clients.ts`) simula una base de datos e implementa lógica de negocio clave:

- **CRUD:** Contiene `actions` (`createClient`, `updateClient`, `deleteClient`) que validan y luego llaman a `mutations` (`ADD_CLIENT`, etc.) para modificar el estado.
- **Validación de Duplicados:** Las acciones `createClient` y `updateClient` contienen lógica para **rechazar correos electrónicos duplicados**, lanzando un `Error` que es capturado por el bloque `try...catch` del formulario.

### 3\. Validación Avanzada (VeeValidate)

Aunque el PDF permitía una validación simple, se decidió integrar **VeeValidate** por las siguientes razones:

- **Separación de Responsabilidades:** Se delegó toda la gestión del estado del formulario (manejo de valores, errores, estado `valid`) a VeeValidate, limpiando enormemente los componentes.
- **Reglas Híbridas:** Se implementó un enfoque híbrido:
  - Se usaron las **reglas predefinidas** de la librería (`@vee-validate/rules`) para campos simples (ej. `'required'`, `'numeric'`).
  - Se mantuvo una **función de validación personalizada** (`validateEmail`) para el correo, que incluye una _regex_ estricta y una validación de TLDs comunes.

### 4\. Diseño Responsivo (Vuetify `useDisplay`)

Se implementó un diseño 100% responsivo usando el _composable_ `useDisplay` de Vuetify:

- **Navegación (`App.vue`):** La barra de navegación (`<v-app-bar>`) muestra botones de texto en escritorio y colapsa a un **menú de hamburguesa animado** (`<v-menu>`) en móviles.
- **Listado (`ClientList.vue`):** El título y el botón de "Nuevo" se adaptan al tamaño de la pantalla.
- **Tabla (`ClientTable.vue`):** El componente cambia su renderizado:
  - **Escritorio:** Muestra una `<v-data-table>` completa.
  - **Móvil:** Muestra una `<v-list>` vertical, que es nativa y fácil de usar en pantallas pequeñas.

---

## 📁 Estructura del Proyecto

```
CRUD_VUE/
├── src/
│ ├── components/       # Componentes "Tontos" (Reutilizables)
│ │ ├── ClientFormFields.vue
│ │ ├── ClientTable.vue
│ │ └── ConfirmDialog.vue
│ │
│ ├── router/           # Configuración de Vue Router
│ │ └── index.ts
│ │
│ ├── stores/           # Configuración de Vuex
│ │ ├── index.ts        # Store principal (une los módulos)
│ │ └── modules/
│ │   └── clients.ts    # Módulo de clientes (state, actions, mutations)
│ │
│ ├── views/            # Vistas "Inteligentes" (Páginas)
│ │ ├── ClientForm.vue
│ │ └── ClientList.vue
│ │
│ ├── App.vue           # Layout principal (App Bar, Router View)
│ └── main.ts           # Punto de entrada (Inicializa Vue, Vuetify, Vuex, Router)
│
├── vite.config.ts      # Configuración de Vite (ej. 'base' para GitHub Pages)
└── README.md           # Esta documentación
```
