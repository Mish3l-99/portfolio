/**
 * Session for the private /jobs area. Credentials come from JOBS_USERNAME /
 * JOBS_PASSWORD; the cookie is an HMAC-signed expiry, keyed by those
 * credentials, so changing the password signs everyone out.
 * Web Crypto only, so it runs in proxy.ts as well as in server actions.
 */

export const SESSION_COOKIE = "jobs_session";
export const SESSION_TTL_S = 60 * 60 * 24 * 14;

const encoder = new TextEncoder();

function credentials() {
  const username = process.env.JOBS_USERNAME?.trim();
  const password = process.env.JOBS_PASSWORD?.trim();
  return username && password ? { username, password } : null;
}

export const jobsAuthConfigured = () => credentials() !== null;

async function hmac(data: string) {
  const creds = credentials();
  if (!creds) throw new Error("JOBS_USERNAME / JOBS_PASSWORD are not set");
  const secret =
    process.env.JOBS_SESSION_SECRET?.trim() ||
    `${creds.username}\0${creds.password}`;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(data)),
  );
  return btoa(String.fromCharCode(...sig))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Compares via HMAC digests so timing doesn't leak how much of a guess was right. */
async function safeEqual(a: string, b: string) {
  const [x, y] = await Promise.all([hmac(`cmp:${a}`), hmac(`cmp:${b}`)]);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.min(x.length, y.length); i++)
    diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

export async function checkCredentials(username: string, password: string) {
  const creds = credentials();
  if (!creds) return false;
  const [u, p] = await Promise.all([
    safeEqual(username, creds.username),
    safeEqual(password, creds.password),
  ]);
  return u && p;
}

export async function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_S;
  return `${exp}.${await hmac(`session:${exp}`)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !credentials()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) * 1000 < Date.now()) return false;
  return safeEqual(sig, await hmac(`session:${exp}`));
}
