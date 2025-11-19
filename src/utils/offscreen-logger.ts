/**
 * Offscreen Document Logger
 * Forwards all console logs from offscreen document to background service worker
 * Makes debugging much easier since offscreen logs are hard to access
 */

import { IS_DEV } from "@/config";

export const MESSAGE_TYPE_LOG = "OFFSCREEN_LOG";

export type LogLevel = "log" | "info" | "warn" | "error" | "debug";

export type LogMessage = {
  type: typeof MESSAGE_TYPE_LOG;
  payload: {
    level: LogLevel;
    args: unknown[];
    timestamp: number;
  };
};

/**
 * Initialize log forwarding in offscreen document
 * Call this at the top of your offscreen/main.ts
 */
export function initOffscreenLogger() {
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  // Intercept each console method
  for (const level of ["log", "info", "warn", "error", "debug"] as LogLevel[]) {
    console[level] = (...args: unknown[]) => {
      // Only log in dev mode (except errors, which always log)
      if (IS_DEV || level === "error") {
        // Still log locally (appears in offscreen console if you can access it)
        originalConsole[level](...args);

        // Forward to background
        try {
          chrome.runtime
            .sendMessage({
              type: MESSAGE_TYPE_LOG,
              payload: {
                level,
                args: args.map(serializeArg),
                timestamp: Date.now(),
              },
            } as LogMessage)
            .catch(() => {
              // Background might not be ready, ignore
            });
        } catch (_err) {
          // Ignore errors during logging
        }
      }
    };
  }

  if (IS_DEV) {
    console.log(
      "[Offscreen Logger] Initialized - logs will appear in background console"
    );
  }
}

/**
 * Serialize arguments for message passing
 * Handles objects, errors, etc.
 */
function serializeArg(arg: unknown): unknown {
  if (arg === null || arg === undefined) {
    return arg;
  }

  if (arg instanceof Error) {
    return {
      __error: true,
      name: arg.name,
      message: arg.message,
      stack: arg.stack,
    };
  }

  if (typeof arg === "object") {
    try {
      // Try to stringify, but limit depth to avoid circular refs
      return JSON.parse(JSON.stringify(arg));
    } catch {
      return String(arg);
    }
  }

  return arg;
}

/**
 * Deserialize arguments in background
 */
export function deserializeArg(arg: unknown): unknown {
  if (
    arg &&
    typeof arg === "object" &&
    "__error" in arg &&
    arg.__error === true
  ) {
    const errorData = arg as {
      __error: true;
      name: string;
      message: string;
      stack?: string;
    };
    const error = new Error(errorData.message);
    error.name = errorData.name;
    if (errorData.stack) {
      error.stack = errorData.stack;
    }
    return error;
  }
  return arg;
}

/**
 * Handle log messages in background service worker
 * Call this in your background message listener
 */
export function handleOffscreenLog(message: LogMessage) {
  if (message.type !== MESSAGE_TYPE_LOG) {
    return false;
  }

  // Only process logs if in dev mode or if it's an error
  const { level, args, timestamp } = message.payload;

  if (!IS_DEV && level !== "error") {
    return true; // Message handled, but not logged
  }

  const deserializedArgs = args.map(deserializeArg);

  // Create timestamp string
  const time = new Date(timestamp).toLocaleTimeString();

  // Log with [Offscreen] prefix and timestamp
  const prefix = `[Offscreen ${time}]`;

  switch (level) {
    case "error":
      console.error(prefix, ...deserializedArgs);
      break;
    case "warn":
      console.warn(prefix, ...deserializedArgs);
      break;
    case "info":
      console.info(prefix, ...deserializedArgs);
      break;
    case "debug":
      console.debug(prefix, ...deserializedArgs);
      break;
    default:
      console.log(prefix, ...deserializedArgs);
  }

  return true;
}
