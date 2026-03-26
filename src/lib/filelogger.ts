import * as fs from "node:fs";
import * as path from "node:path";

/**
 * FileLogger - 简单的文件日志器
 *
 * 用于 opencode 插件将日志输出到文件，而不是 console.log
 * 日志文件输出到项目目录: {worktree}/.gomtm.vol/logs/opencode.log
 */

// 日志级别定义
export type LogLevel = "debug" | "info" | "warn" | "error";

// 日志级别优先级
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// 全局日志器实例
let globalLogger: FileLogger | null = null;
// 全局 worktree 路径
let globalWorktree: string | null = null;

/**
 * 文件日志器类
 */
export class FileLogger {
  private logFilePath: string;
  private minLevel: LogLevel;
  private initialized: boolean = false;

  constructor(logFilePath: string, minLevel: LogLevel = "debug") {
    this.logFilePath = logFilePath;
    this.minLevel = minLevel;
    this.ensureLogDir();
  }

  /**
   * 确保日志目录存在
   */
  private ensureLogDir(): void {
    try {
      const logDir = path.dirname(this.logFilePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      this.initialized = true;
    } catch (err) {
      console.error(`[FileLogger] 无法创建日志目录: ${err}`);
      this.initialized = false;
    }
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const levelTag = `[${level.toUpperCase()}]`.padEnd(7);
    let logLine = `${timestamp} ${levelTag} ${message}`;

    if (data !== undefined) {
      if (typeof data === "object" && data !== null) {
        try {
          logLine += ` ${JSON.stringify(data)}`;
        } catch {
          logLine += ` [无法序列化的对象]`;
        }
      } else {
        logLine += ` ${data}`;
      }
    }

    return logLine + "\n";
  }

  /**
   * 写入日志到文件
   */
  private write(level: LogLevel, message: string, data?: unknown): void {
    // 检查日志级别
    if (LOG_LEVELS[level] < LOG_LEVELS[this.minLevel]) {
      return;
    }

    if (!this.initialized) {
      console.error(`[FileLogger] 日志器未正确初始化，回退到 console: ${message}`);
      console[level](message, data);
      return;
    }

    try {
      const formattedMessage = this.formatMessage(level, message, data);
      fs.appendFileSync(this.logFilePath, formattedMessage, "utf-8");
    } catch (err) {
      // 写入失败时回退到 console
      console.error(`[FileLogger] 写入日志失败: ${err}`);
      console[level](message, data);
    }
  }

  debug(message: string, data?: unknown): void {
    this.write("debug", message, data);
  }

  info(message: string, data?: unknown): void {
    this.write("info", message, data);
  }

  warn(message: string, data?: unknown): void {
    this.write("warn", message, data);
  }

  error(message: string, data?: unknown): void {
    this.write("error", message, data);
  }

  getLogFilePath(): string {
    return this.logFilePath;
  }

  clear(): void {
    try {
      fs.writeFileSync(this.logFilePath, "", "utf-8");
    } catch (err) {
      console.error(`[FileLogger] 清空日志失败: ${err}`);
    }
  }

  /**
   * 记录环境信息
   */
  logEnvironment(input?: any): void {
    const env = {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      worktree: input?.directory || process.cwd(),
      project: input?.project || "unknown",
      directory: input?.directory || "unknown",
      worktree_info: input?.worktree || "unknown",
      env_vars: {
        MTM_DEV: process.env.MTM_DEV,
        NODE_ENV: process.env.NODE_ENV,
        SUPABASE_URL: process.env.SUPABASE_URL ? "set" : "not_set",
      },
      timestamp: new Date().toISOString(),
    };

    this.info("=== Plugin Environment ===");
    this.info("Environment info", env);
    this.info("=== End Environment ===");
  }
}

/**
 * 获取基于 worktree 的日志文件路径
 */
export function getLogFilePath(worktree?: string): string {
  let baseDir = worktree || globalWorktree || process.cwd();
  if (typeof baseDir !== "string") {
    // Fallback to current working directory if baseDir is not a string
    // This prevents "TypeError: The "paths[0]" property must be of type string, got object"
    // which happens if some upstream caller passes an object instead of a string path.
    try {
      console.warn(`[FileLogger] getLogFilePath received non-string baseDir: ${typeof baseDir}, falling back to cwd`);
    } catch {
      // ignore console errors
    }
    baseDir = process.cwd();
  }
  return path.join(baseDir, ".gomtm.vol", "logs", "opencode.log");
}

/**
 * 初始化日志器
 * 应当在插件初始化时调用，传入 worktree 路径
 */
export function initLogger(worktree: string): FileLogger {
  globalWorktree = worktree;
  const logPath = getLogFilePath(worktree);
  globalLogger = new FileLogger(logPath);
  return globalLogger;
}

/**
 * 获取全局日志器实例
 * 如果尚未初始化，使用当前工作目录
 */
export function getLogger(): FileLogger {
  if (!globalLogger) {
    const logPath = getLogFilePath();
    globalLogger = new FileLogger(logPath);
  }
  return globalLogger;
}

// 便捷日志函数
export function logDebug(message: string, data?: unknown): void {
  getLogger().debug(message, data);
}

export function logInfo(message: string, data?: unknown): void {
  getLogger().info(message, data);
}

export function logWarn(message: string, data?: unknown): void {
  getLogger().warn(message, data);
}

export function logError(message: string, data?: unknown): void {
  getLogger().error(message, data);
}

export default FileLogger;
