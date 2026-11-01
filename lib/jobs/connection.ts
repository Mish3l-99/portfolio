import fs from "node:fs";
import path from "node:path";

import { jobsPaths } from "./config";

/**
 * Whether the bot's Chrome profile is signed in, read straight from the
 * profile's cookie store (names and expiry only — values stay encrypted).
 * Chrome flushes cookies every ~30s, so a fresh login can take a moment to show.
 * Keyring-encrypted ("v11") cookies don't count: the bot's Chrome can't decrypt them.
 */

export type Connection = { linkedin: boolean; indeed: boolean };

// The cookies each site sets only once you're signed in.
const SIGNED_IN = {
  linkedin: { host: "%linkedin.com", names: ["li_at"] },
  indeed: { host: "%indeed.com", names: ["SHOE", "SOCK"] },
};

/** Chrome stores expiry as microseconds since 1601-01-01; 0 means a session cookie. */
const CHROME_EPOCH_OFFSET_US = BigInt("11644473600000000");

export async function connectionStatus(): Promise<Connection> {
  const file = path.join(jobsPaths.profile, "Default", "Cookies");
  if (!fs.existsSync(file)) return { linkedin: false, indeed: false };
  try {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(file, { readOnly: true });
    try {
      const nowUs = BigInt(Date.now()) * BigInt(1000) + CHROME_EPOCH_OFFSET_US;
      const check = ({ host, names }: { host: string; names: string[] }) => {
        const rows = db
          .prepare(
            `select cast(expires_utc as text) as expires from cookies where host_key like ? and name in (${names.map(() => "?").join(",")}) and substr(encrypted_value, 1, 3) != 'v11'`,
          )
          .all(host, ...names) as { expires: string }[];
        return rows.some((r) => r.expires === "0" || BigInt(r.expires) > nowUs);
      };
      return {
        linkedin: check(SIGNED_IN.linkedin),
        indeed: check(SIGNED_IN.indeed),
      };
    } finally {
      db.close();
    }
  } catch {
    return { linkedin: false, indeed: false };
  }
}

export type Site = keyof Connection;

const SITE_HOSTS: Record<Site, string> = {
  linkedin: "%linkedin.com",
  indeed: "%indeed.com",
};

/**
 * Signs the bot's profile out of one site by deleting its cookies (including any
 * half-finished verification state). Chrome must not be running on the profile.
 */
export async function resetSite(site: Site) {
  const file = path.join(jobsPaths.profile, "Default", "Cookies");
  if (!fs.existsSync(file)) return 0;
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(file);
  try {
    const { changes } = db
      .prepare("delete from cookies where host_key like ?")
      .run(SITE_HOSTS[site]);
    return Number(changes);
  } finally {
    db.close();
  }
}
