/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly REACT_APP_OPENAI_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}