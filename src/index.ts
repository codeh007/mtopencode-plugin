import type { Plugin, PluginInput } from "@opencode-ai/plugin";
import * as fs from "node:fs";
import { tool_debug_plugin_status_v2 } from "./tools/debug1";

function ensurePluginDirectory(input: PluginInput): void {
  if (input.directory && !fs.existsSync(input.directory)) {
    fs.mkdirSync(input.directory, { recursive: true });
  }
}

export const MtopencodePlugin: Plugin = async (input: PluginInput) => {
  ensurePluginDirectory(input);

  return {
    tool: {
      ...tool_debug_plugin_status_v2,
    },
  };
};

export const SchedulerPlugin = MtopencodePlugin;

export default MtopencodePlugin;
