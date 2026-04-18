const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Fires when the token is cleared in another tab (or all storage is wiped).
// The native `storage` event only fires in OTHER tabs, not the one that wrote.
export function onTokenRemovedInOtherTab(handler: () => void): () => void {
  function listener(event: StorageEvent) {
    const tokenCleared = event.key === TOKEN_KEY && event.newValue === null;
    const allCleared = event.key === null;
    if (tokenCleared || allCleared) {
      handler();
    }
  }
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}
