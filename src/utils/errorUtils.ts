/**
 * Utility functions for handling and extracting error messages
 */

export interface SupabaseError {
  message?: string;
  error_description?: string;
  hint?: string;
  details?: string;
  code?: string;
}

/**
 * Extracts a readable error message from any error object
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) {
    return "Erro desconhecido";
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message || "Erro desconhecido";
  }

  // String error
  if (typeof error === "string") {
    return error;
  }

  // Object with error properties (including Supabase errors)
  if (typeof error === "object" && error !== null) {
    const errorObj = error as SupabaseError & Record<string, any>;

    // Try different common error message properties
    const messageCandidates = [
      errorObj.message,
      errorObj.error_description,
      errorObj.hint,
      errorObj.details,
      errorObj.error,
      errorObj.msg,
      errorObj.description,
    ];

    for (const candidate of messageCandidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }

    // If it's an object with a code, include that
    if (errorObj.code) {
      return `Erro ${errorObj.code}: ${JSON.stringify(error)}`;
    }

    // Last resort: stringify the object but make it readable
    try {
      const stringified = JSON.stringify(error, null, 2);
      if (stringified && stringified !== "{}") {
        return `Erro: ${stringified}`;
      }
    } catch {
      // JSON.stringify failed, fall through to default
    }
  }

  // Fallback for any other type
  return `Erro: ${String(error)}`;
}

/**
 * Logs an error with proper formatting
 */
export function logError(context: string, error: unknown): void {
  const message = extractErrorMessage(error);
  console.error(`${context}:`, message);

  // Also log the raw error for debugging
  if (error !== message) {
    console.error("Raw error object:", error);
  }
}

/**
 * Creates a user-friendly error message
 */
export function createUserErrorMessage(
  context: string,
  error: unknown,
): string {
  const message = extractErrorMessage(error);
  return `${context}: ${message}`;
}
