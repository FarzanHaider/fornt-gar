export async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function loginRequest(payload: any) {
  return fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function logoutRequest() {
  return fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
