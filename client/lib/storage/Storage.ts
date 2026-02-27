/**
 * Storage.ts — web port of the React Native MMKV-based Storage utility.
 *
 * On web, `localStorage` is the equivalent of MMKV's synchronous key-value store.
 * We wrap it in the same API shape so the rest of the codebase stays consistent
 * with the React Native implementation.
 */

// ---------------------------------------------------------------------------
// General storage (non-sensitive data)
// RN equivalent: `new MMKV({ id: "BAROPLATE" })`
// ---------------------------------------------------------------------------
export const storage = {
  set: (key: string, value: string | number | boolean): void => {
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      console.error("Storage.set error:", error);
    }
  },

  getString: (key: string): string | undefined => {
    try {
      return localStorage.getItem(key) ?? undefined;
    } catch (error) {
      console.error("Storage.getString error:", error);
      return undefined;
    }
  },

  getNumber: (key: string): number | undefined => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? Number(val) : undefined;
    } catch (error) {
      console.error("Storage.getNumber error:", error);
      return undefined;
    }
  },

  getBoolean: (key: string): boolean | undefined => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val === "true" : undefined;
    } catch (error) {
      console.error("Storage.getBoolean error:", error);
      return undefined;
    }
  },

  delete: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Storage.delete error:", error);
    }
  },

  contains: (key: string): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error("Storage.contains error:", error);
      return false;
    }
  },

  getAllKeys: (): string[] => {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error("Storage.getAllKeys error:", error);
      return [];
    }
  },

  clearAll: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Storage.clearAll error:", error);
    }
  },
};

// ---------------------------------------------------------------------------
// Secure storage (sensitive data: tokens, etc.)
// RN equivalent: `new MMKV({ id: "BAROPLATE_SECURE", encryptionKey: "..." })`
//
// On web there is no native encrypted storage in localStorage.
// We use the same localStorage for now, but namespace keys with a prefix
// so they are logically separated — and can be swapped for a real
// encrypted solution (e.g. IndexedDB + WebCrypto) in the future.
// ---------------------------------------------------------------------------
const SECURE_PREFIX = "__secure__";

const secureStorage = {
  setItem: async (key: string, value: string): Promise<boolean> => {
    try {
      localStorage.setItem(`${SECURE_PREFIX}${key}`, value);
      return true;
    } catch (error) {
      console.error("SecureStorage.setItem error:", error);
      return false;
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      return localStorage.getItem(`${SECURE_PREFIX}${key}`);
    } catch (error) {
      console.error("SecureStorage.getItem error:", error);
      return null;
    }
  },

  removeItem: async (key: string): Promise<boolean> => {
    try {
      localStorage.removeItem(`${SECURE_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error("SecureStorage.removeItem error:", error);
      return false;
    }
  },

  contains: (key: string): boolean => {
    try {
      return localStorage.getItem(`${SECURE_PREFIX}${key}`) !== null;
    } catch (error) {
      console.error("SecureStorage.contains error:", error);
      return false;
    }
  },

  getAllKeys: (): string[] => {
    try {
      return Object.keys(localStorage)
        .filter((k) => k.startsWith(SECURE_PREFIX))
        .map((k) => k.slice(SECURE_PREFIX.length));
    } catch (error) {
      console.error("SecureStorage.getAllKeys error:", error);
      return [];
    }
  },

  clearAll: (): boolean => {
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(SECURE_PREFIX)
      );
      keys.forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (error) {
      console.error("SecureStorage.clearAll error:", error);
      return false;
    }
  },
};

export { secureStorage };
