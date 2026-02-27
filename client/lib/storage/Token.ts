import { jwtDecode } from "jwt-decode";
import { fromUnixTime, isPast } from "date-fns";

/**
 * Token.ts — web port of the React Native Token.ts utility.
 * Decodes and validates JWT access tokens.
 */

export type TDecodedAccessToken = {
  authorities: string[];
  exp: number;
  iat: number;
  jti: string;
  refreshId: string;
  sub: string;
  userId: number;
};

export const decodeAccessToken = (accessToken: string): TDecodedAccessToken =>
  JSON.parse(JSON.stringify(jwtDecode(accessToken)));

export const isTokenExpired = (accessToken: string): boolean => {
  if (!accessToken) return false;
  try {
    const { exp } = decodeAccessToken(accessToken);
    const expireDate = fromUnixTime(exp);
    return isPast(expireDate);
  } catch {
    return false;
  }
};
