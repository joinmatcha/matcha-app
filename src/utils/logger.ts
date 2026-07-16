type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';
type LogContext = Record<string, unknown>;

const LOG_LEVELS: Record<Exclude<LogLevel, 'silent'>, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel =
  (process.env.EXPO_PUBLIC_LOG_LEVEL as LogLevel) ??
  (process.env.NODE_ENV === 'test' ? 'silent' : __DEV__ ? 'debug' : 'warn');

const currentLevel =
  configuredLevel in LOG_LEVELS || configuredLevel === 'silent'
    ? configuredLevel
    : __DEV__
      ? 'debug'
      : 'warn';

const SENSITIVE_KEYS = [
  'authorization',
  'cookie',
  'password',
  'token',
  'jwt',
  'secret',
];

function shouldLog(level: Exclude<LogLevel, 'silent'>) {
  if (currentLevel === 'silent') return false;
  return (
    LOG_LEVELS[level] >= LOG_LEVELS[currentLevel as Exclude<LogLevel, 'silent'>]
  );
}

function redact(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: __DEV__ ? value.stack : undefined,
    };
  }
  if (Array.isArray(value)) return value.map(redact);

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => {
      const normalizedKey = key.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
        normalizedKey.includes(sensitiveKey),
      );
      return [key, isSensitive ? '[redacted]' : redact(item)];
    }),
  );
}

function write(
  level: Exclude<LogLevel, 'silent'>,
  message: string,
  context?: LogContext,
) {
  if (!shouldLog(level)) return;

  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context: redact(context) } : {}),
  };

  const line = `[matcha:${level}] ${JSON.stringify(entry)}`;
  // In React Native dev builds, console.warn/error triggers LogBox overlays.
  // Keep structured logs visible in Metro without disturbing the app UI.
  console.log(line);
}

export const logger = {
  debug: (message: string, context?: LogContext) =>
    write('debug', message, context),
  info: (message: string, context?: LogContext) =>
    write('info', message, context),
  warn: (message: string, context?: LogContext) =>
    write('warn', message, context),
  error: (message: string, context?: LogContext) =>
    write('error', message, context),
};
