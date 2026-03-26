import { createClient } from "@supabase/supabase-js";
import type { AuditAsset, AuditFinding, AuditProjectContext, AuditSkill, AuditTask } from "./audit-schemas";
import { FileLogger } from "./filelogger";

// 创建 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL || "https://mock.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "mock-key";

const logger = new FileLogger("/tmp/audit-tools.log");

// 注意：在实际环境中，这些工具需要通过 mtopencode-plugin 插件系统注册
// 这里提供核心实现逻辑，将在插件的主入口文件中注册为 MCP 工具

/**
 * 获取审计项目的完整上下文信息
 */
export async function getAuditProjectContext(project_id: string): Promise<AuditProjectContext | null> {
  try {
    logger.info(`获取审计项目上下文: ${project_id}`);

    // 这里应该使用 Supabase RPC 调用，而不是直接查询表
    // 目前模拟实现，实际需要调用相应的 RPC 函数

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 获取项目基本信息
    const { data: project, error: projectError } = await supabase.rpc("audit_project_get", {
      p_id: project_id,
    });

    if (projectError || !project) {
      logger.error(`获取项目信息失败: ${projectError?.message}`);
      return null;
    }

    // 获取项目统计数据
    const { data: stats, error: statsError } = await supabase.rpc("audit_project_dashboard_stats", {
      p_project_id: project_id,
    });

    if (statsError) {
      logger.error(`获取项目统计失败: ${statsError.message}`);
      return null;
    }

    // 获取最近资产
    const { data: recentAssets } = await supabase.rpc("audit_asset_list", {
      p_project_id: project_id,
      p_limit: 5,
    });

    // 获取最近漏洞
    const { data: recentFindings } = await supabase.rpc("audit_finding_list", {
      p_project_id: project_id,
      p_limit: 5,
    });

    return {
      project: project[0] || {},
      stats: stats[0] || {
        total_assets: 0,
        total_findings: 0,
        critical_findings: 0,
        high_findings: 0,
        recent_tasks: 0,
      },
      recent_assets: recentAssets || [],
      recent_findings: recentFindings || [],
    };
  } catch (error) {
    logger.error(`获取审计项目上下文异常: ${error}`);
    return null;
  }
}

/**
 * 获取审计项目的资产列表
 */
export async function getAuditAssetsList(params: {
  project_id: string;
  asset_type?: string;
  status?: string;
  limit?: number;
}): Promise<AuditAsset[]> {
  try {
    logger.info(`获取资产列表: ${JSON.stringify(params)}`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.rpc("audit_asset_list", {
      p_project_id: params.project_id,
      p_asset_type: params.asset_type,
      p_status: params.status,
      p_limit: params.limit || 50,
    });

    if (error) {
      logger.error(`获取资产列表失败: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error(`获取资产列表异常: ${error}`);
    return [];
  }
}

/**
 * 获取审计项目的漏洞列表
 */
export async function getAuditFindingsList(params: {
  project_id: string;
  severity?: string;
  status?: string;
  limit?: number;
}): Promise<AuditFinding[]> {
  try {
    logger.info(`获取漏洞列表: ${JSON.stringify(params)}`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.rpc("audit_finding_list", {
      p_project_id: params.project_id,
      p_severity: params.severity,
      p_status: params.status,
      p_limit: params.limit || 50,
    });

    if (error) {
      logger.error(`获取漏洞列表失败: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error(`获取漏洞列表异常: ${error}`);
    return [];
  }
}

/**
 * 获取审计项目的任务历史
 */
export async function getAuditTasksHistory(params: {
  project_id: string;
  status?: string;
  limit?: number;
}): Promise<AuditTask[]> {
  try {
    logger.info(`获取任务历史: ${JSON.stringify(params)}`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.rpc("task_list_cursor", {
      p_context_type: "audit",
      p_context_id: params.project_id,
      p_status: params.status || null,
      p_limit: params.limit || 20,
    });

    if (error) {
      logger.error(`获取任务历史失败: ${error.message}`);
      return [];
    }

    return (data || []).map((task: any) => ({
      id: task.id,
      project_id: task.context_id,
      title: task.title,
      description: task.description,
      code_type: task.code_type,
      status: task.status,
      result: task.result,
      result_text: task.result_text,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));
  } catch (error) {
    logger.error(`获取任务历史异常: ${error}`);
    return [];
  }
}

/**
 * 获取可用的审计技能
 */
export async function getAuditSkillsAvailable(params: {
  project_id: string;
  category?: string;
}): Promise<AuditSkill[]> {
  try {
    logger.info(`获取可用技能: ${JSON.stringify(params)}`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.rpc("audit_skill_list", {
      p_project_id: params.project_id,
      p_category: params.category,
    });

    if (error) {
      logger.error(`获取可用技能失败: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error(`获取可用技能异常: ${error}`);
    return [];
  }
}

/**
 * 创建新的漏洞发现
 */
export async function createAuditFinding(params: {
  project_id: string;
  title: string;
  description: string;
  severity: string;
  proof_poc?: string;
  remediation?: string;
  asset_id?: string;
}): Promise<{ success: boolean; finding_id?: string; error?: string }> {
  try {
    logger.info(`创建漏洞发现: ${JSON.stringify(params)}`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.rpc("audit_finding_upsert", {
      p_id: null, // 新建
      p_project_id: params.project_id,
      p_title: params.title,
      p_description: params.description,
      p_severity: params.severity,
      p_proof_poc: params.proof_poc,
      p_remediation: params.remediation,
      p_asset_id: params.asset_id,
      p_status: "open",
    });

    if (error) {
      logger.error(`创建漏洞发现失败: ${error.message}`);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      finding_id: data?.[0]?.id,
    };
  } catch (error) {
    logger.error(`创建漏洞发现异常: ${error}`);
    return { success: false, error: String(error) };
  }
}

/**
 * 添加新的资产
 */
export async function addAuditAsset(params: {
  project_id: string;
  asset_type: string;
  content: string;
  fingerprint?: Record<string, any>;
  source?: string;
}): Promise<{ success: boolean; asset_id?: string; error?: string }> {
  try {
    logger.info(`添加资产: ${JSON.stringify(params)}`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.rpc("audit_asset_upsert", {
      p_id: null, // 新建
      p_project_id: params.project_id,
      p_asset_type: params.asset_type,
      p_content: params.content,
      p_fingerprint: params.fingerprint,
      p_source: params.source,
      p_status: "pending",
    });

    if (error) {
      logger.error(`添加资产失败: ${error.message}`);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      asset_id: data?.[0]?.id,
    };
  } catch (error) {
    logger.error(`添加资产异常: ${error}`);
    return { success: false, error: String(error) };
  }
}
