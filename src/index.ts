import type { Plugin, PluginInput } from "@opencode-ai/plugin";
import * as fs from "node:fs";
import { tool_debug_plugin_status_v2 } from "./tools/debug1";

// const logger = new FileLogger("/tmp/audit-plugin.log");

export const SchedulerPlugin: Plugin = async (input: PluginInput) => {
  if (input.directory && !fs.existsSync(input.directory)) {
    //!!! 重要,由于 audit project 的工作目录是动态的,这样确保目录存在
    fs.mkdirSync(input.directory, { recursive: true });
  }

  // 记录插件初始化信息
  // logger.info(`Plugin initialized with directory: ${input.directory}`);
  // logger.logEnvironment(input);

  return {
    tool: {
      ...tool_debug_plugin_status_v2,

      // // 审计项目上下文工具
      // audit_project_context: tool({
      //   description: "获取审计项目的完整上下文信息，包括项目基本信息、统计数据、资产概览、漏洞状态等",
      //   args: {},
      //   async execute() {
      //     logger.info("执行 audit_project_context");
      //     // 暂时返回模拟数据，实际实现需要调用数据库
      //     const result = {
      //       project: {
      //         id: "demo-project-id",
      //         name: "Demo Audit Project",
      //         target: "example.com",
      //         created_at: new Date().toISOString(),
      //       },
      //       stats: {
      //         total_assets: 10,
      //         total_findings: 3,
      //         critical_findings: 1,
      //         high_findings: 1,
      //         recent_tasks: 5,
      //       },
      //       recent_assets: [],
      //       recent_findings: [],
      //     };
      //     return JSON.stringify(result, null, 2);
      //   },
      // }),

      // // 资产列表工具
      // audit_assets_list: tool({
      //   description: "获取审计项目中的资产列表，支持按类型、状态过滤",
      //   args: {},
      //   async execute() {
      //     logger.info("执行 audit_assets_list");
      //     return JSON.stringify([], null, 2);
      //   },
      // }),

      // // 漏洞列表工具
      // audit_findings_list: tool({
      //   description: "获取审计项目中的漏洞发现列表，支持按严重程度、状态过滤",
      //   args: {},
      //   async execute() {
      //     logger.info("执行 audit_findings_list");
      //     return JSON.stringify([], null, 2);
      //   },
      // }),

      // // 任务历史工具
      // audit_tasks_history: tool({
      //   description: "获取审计项目的任务历史记录，了解之前的审计活动和结果",
      //   args: {},
      //   async execute() {
      //     logger.info("执行 audit_tasks_history");
      //     return JSON.stringify([], null, 2);
      //   },
      // }),

      // // 可用技能工具
      // audit_skills_available: tool({
      //   description: "获取审计项目可用的技能列表，包括安全工具、POC脚本等",
      //   args: {},
      //   async execute() {
      //     logger.info("执行 audit_skills_available");
      //     return JSON.stringify([], null, 2);
      //   },
      // }),

      // // 创建漏洞工具
      // audit_create_finding: tool({
      //   description: "创建新的漏洞发现记录，当 Agent 发现安全问题时记录到数据库中",
      //   args: {},
      //   async execute() {
      //     logger.info("执行 audit_create_finding");
      //     return JSON.stringify({ success: true, finding_id: "demo-finding-id" }, null, 2);
      //   },
      // }),

      // // 添加资产工具
      // audit_add_asset: tool({
      //   description: "添加新的资产记录，当 Agent 发现新的攻击面时记录到数据库中",
      //   args: {},
      //   async execute() {
      //     logger.info("执行 audit_add_asset");
      //     return JSON.stringify({ success: true, asset_id: "demo-asset-id" }, null, 2);
      //   },
      // }),
    },
  };
};

export default SchedulerPlugin;
