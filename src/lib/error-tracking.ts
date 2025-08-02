type ErrorWithMessage = {
  message: string;
  stack?: string;
  code?: string;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
};

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

export const logError = (error: unknown) => {
  const errorWithMessage = toErrorWithMessage(error);
  
  // In production, you might want to send this to a service like Sentry
  console.error('Error:', {
    message: errorWithMessage.message,
    stack: errorWithMessage.stack,
    code: errorWithMessage.code,
  });

  // Return formatted error for UI
  return {
    message: errorWithMessage.message,
    code: errorWithMessage.code,
  };
};
