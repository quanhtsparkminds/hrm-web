export const ERROR_CODE_MAP: Record<string, string> = {
    // Auth errors
    "private.error.signup.account-inactive": "Account is inactive. Please contact administrator.",
    "private.error.auth.invalid-credentials": "Invalid username or password.",
    "private.error.signup.email-exists": "Email already exists.",
    "private.error.signup.username-exists": "Username already exists.",

    // Default fallback
    "default": "An unexpected error occurred. Please try again later."
};

export const getErrorMessage = (errorCode: string, defaultMessage?: string): string => {
    return ERROR_CODE_MAP[errorCode] || defaultMessage || ERROR_CODE_MAP["default"];
};
