/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de base de l'API SkillSwap (ex: http://localhost:8000/api). */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
