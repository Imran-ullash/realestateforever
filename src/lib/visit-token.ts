// In-memory visit token. Resets every time the site is accessed, refreshed, or opened.
// It is never persisted to cookies, sessionStorage, or localStorage, ensuring that
// every site access requires entering the password.
let inMemoryToken = "";

if (typeof window !== "undefined") {
  try {
    window.sessionStorage.removeItem("ref-visit-token");
    window.localStorage.removeItem("ref-visit-token");
  } catch {
    /* ignore */
  }
}

export function getVisitToken(): string {
  return inMemoryToken;
}

export function setVisitToken(token: string) {
  inMemoryToken = token;
}

