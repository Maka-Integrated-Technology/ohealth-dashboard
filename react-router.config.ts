import type { Config } from "@react-router/dev/config";
import { loadEnv } from "vite";

Object.assign(process.env, loadEnv(process.env.NODE_ENV!, process.cwd()));

export default {
  ssr: false,
} satisfies Config;
