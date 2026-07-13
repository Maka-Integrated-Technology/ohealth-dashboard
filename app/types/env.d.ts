/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  /**
   * Which dashboard surface to build/serve. Consumed at config time by
   * `app/routes.ts` to select the active route folder.
   * One of: "mp-dashboard" | "ph-dashboard" | "lb-dashboard"
   * (aliases: "mp" | "ph" | "lb"). Defaults to "mp-dashboard".
   */
  readonly VITE_ROUTE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
