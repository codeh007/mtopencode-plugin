import { tool } from "@opencode-ai/plugin/tool";

export const tool_debug_plugin_status_v2 = {
  debug_plugin_status_v3: tool({
    description: "Check whether mtopencode-plugin is loaded and working.",
    args: {},
    async execute() {
      return "mtopencode-plugin is active and working.";
    },
  }),
};
