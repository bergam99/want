import { jwtDecode } from "jwt-decode";

/**
 * isTokenExpired
 * @returns boolean
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    if (!decoded.exp) return true;

    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
}

/**
 * getAuthToken
 *  use this outside of jsx
 * @returns token
 */
export const getAuthToken = () => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }

  return token;
};

/**
 * Load token at root level
 * use with useRouteLoaderData("root") when inside jsx
 */
export const tokenLoader = () => {
  return getAuthToken();
};

type TokenType = {
  sub: string;
  userId: number;
  iat: number;
  exp: number;
};

/**
 * Get all payload
 */
export const jwtDecoder = (token?: string | null) => {
  let decoded: TokenType | null = null;

  if (token) {
    decoded = jwtDecode<TokenType>(token);
  }
  return decoded;
};
