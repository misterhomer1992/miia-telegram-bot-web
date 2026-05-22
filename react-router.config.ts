import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: ["/", "/uk", "/pl"],
  appDirectory: "src",
} satisfies Config;
