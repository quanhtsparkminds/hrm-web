import i18n from "@/i18n";

export const ERROR_CODE_TO_KEY: Record<string, string> = {
    // Auth errors
    "private.error.signup.account-inactive": "accountInactive",
    "private.error.auth.invalid-credentials": "invalidCredentials",
    "private.error.signup.email-exists": "emailExists",
    "private.error.signup.username-exists": "usernameExists",
};

export const getErrorMessage = (errorCode: string, defaultMessage?: string): string => {
    const translationKey = ERROR_CODE_TO_KEY[errorCode];
    if (translationKey && i18n.exists(`error:${translationKey}`)) {
        return i18n.t(`error:${translationKey}`);
    }
    return defaultMessage || i18n.t("error:unexpectedError");
};
