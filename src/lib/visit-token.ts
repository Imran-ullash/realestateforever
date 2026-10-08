// Tab session visit token. Persists in sessionStorage for the duration
// of the browser tab/session so users never get prompted for password
// while navigating, waiting, or refreshing. Cleared automatically when the tab is closed.
const TOKEN_KEY = "ref-visit-token-v2";
let inMemoryToken = "";

export function getVisitToken(): string {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem(TOKEN_KEY);
      if (stored) {
        inMemoryToken = stored;
        return stored;
      }
    } catch {
      /* ignore */
    }
  }
  return "";
}

export function setVisitToken(token: string) {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    try {
      if (token) {
        window.sessionStorage.setItem(TOKEN_KEY, token);
      } else {
        window.sessionStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      /* ignore */
    }
  }
}

export function clearVisitToken() {
  inMemoryToken = "";
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  }
}

