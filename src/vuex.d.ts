// src/vuex.d.ts

// Esto le dice a TypeScript cómo debe "ver" el módulo 'vuex'
declare module 'vuex' {
  // Exportamos el tipo 'Store' original de la librería
  export * from 'vuex/types/index.d.ts'

  // Exportamos los helpers (mapState, mapGetters, etc.)
  export * from 'vuex/types/helpers.d.ts'

  // Exportamos el store principal
  export { Store } from 'vuex/types/index.d.ts'
}
