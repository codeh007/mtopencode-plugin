import { z } from "zod";

// Audit MCP Tools 的参数验证 schemas
export const AuditProjectContextSchema = z.object({
  project_id: z.string().describe("审计项目ID"),
});

export const AuditAssetsListSchema = z.object({
  project_id: z.string().describe("审计项目ID"),
  asset_type: z.enum(["domain", "ip", "url", "api_endpoint", "secret"]).optional().describe("资产类型过滤"),
  status: z.enum(["pending", "confirmed", "false_positive"]).optional().describe("资产状态过滤"),
  limit: z.number().default(50).describe("返回结果数量限制"),
});

export const AuditFindingsListSchema = z.object({
  project_id: z.string().describe("审计项目ID"),
  severity: z.enum(["critical", "high", "medium", "low", "info"]).optional().describe("漏洞严重程度过滤"),
  status: z.enum(["open", "confirmed", "fixed", "false_positive"]).optional().describe("漏洞状态过滤"),
  limit: z.number().default(50).describe("返回结果数量限制"),
});

export const AuditTasksHistorySchema = z.object({
  project_id: z.string().describe("审计项目ID"),
  status: z.enum(["pending", "running", "completed", "failed"]).optional().describe("任务状态过滤"),
  limit: z.number().default(20).describe("返回结果数量限制"),
});

export const AuditSkillsAvailableSchema = z.object({
  project_id: z.string().describe("审计项目ID"),
  category: z.string().optional().describe("技能分类过滤（如：reconnaissance, vulnerability_scanning, exploitation）"),
});

export const AuditCreateFindingSchema = z.object({
  project_id: z.string().describe("审计项目ID"),
  title: z.string().describe("漏洞标题"),
  description: z.string().describe("详细描述"),
  severity: z.enum(["critical", "high", "medium", "low", "info"]).describe("严重程度"),
  proof_poc: z.string().optional().describe("复现步骤或POC"),
  remediation: z.string().optional().describe("修复建议"),
  asset_id: z.string().optional().describe("关联的资产ID（可选）"),
});

export const AuditAddAssetSchema = z.object({
  project_id: z.string().describe("审计项目ID"),
  asset_type: z.enum(["domain", "ip", "url", "api_endpoint", "secret"]).describe("资产类型"),
  content: z.string().describe("资产内容（如域名、IP地址、URL等）"),
  fingerprint: z.record(z.string(), z.any()).optional().describe("技术栈指纹信息（JSON对象）"),
  source: z.string().optional().describe("发现来源（如：subfinder, nuclei, manual）"),
});

// Type definitions for the API responses
export interface AuditProjectContext {
  project: {
    id: string;
    name: string;
    target: string;
    description?: string;
    repo_url?: string;
    repo_branch?: string;
    created_at: string;
    updated_at: string;
  };
  stats: {
    total_assets: number;
    total_findings: number;
    critical_findings: number;
    high_findings: number;
    recent_tasks: number;
  };
  recent_assets: Array<{
    id: string;
    asset_type: string;
    content: string;
    status: string;
    created_at: string;
  }>;
  recent_findings: Array<{
    id: string;
    title: string;
    severity: string;
    status: string;
    created_at: string;
  }>;
}

export interface AuditAsset {
  id: string;
  project_id: string;
  asset_type: string;
  content: string;
  fingerprint?: Record<string, any>;
  status: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditFinding {
  id: string;
  project_id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  proof_poc?: string;
  remediation?: string;
  asset_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditTask {
  id: string;
  project_id: string; // context_id
  title: string;
  description?: string;
  code_type?: string;
  status: string;
  result?: any;
  result_text?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditSkill {
  id: string;
  name: string;
  description: string;
  category?: string;
  source_path: string;
  parameters_schema?: Record<string, any>;
  dependencies?: string[];
  version?: string;
}
