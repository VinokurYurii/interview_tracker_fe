type Handler = () => void;

const unauthorizedHandlers = new Set<Handler>();

export function onUnauthorized(handler: Handler): () => void {
  unauthorizedHandlers.add(handler);
  return () => {
    unauthorizedHandlers.delete(handler);
  };
}

export function notifyUnauthorized(): void {
  unauthorizedHandlers.forEach((handler) => handler());
}
