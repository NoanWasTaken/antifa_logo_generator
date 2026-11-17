import { headers } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

export async function isAdminRequest(): Promise<boolean> {
  const rawTeamDomain = process.env.CF_ACCESS_TEAM_DOMAIN;
  const teamDomain = rawTeamDomain
    ? (rawTeamDomain.startsWith("http")
        ? rawTeamDomain
        : `https://${rawTeamDomain}`
      ).replace(/\/$/, "")
    : undefined;

  const audiences = (process.env.CF_ACCESS_AUD ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!teamDomain || audiences.length === 0) {

    return process.env.NODE_ENV !== "production";
  }

  const token = (await headers()).get("cf-access-jwt-assertion");
  if (!token) {

    return process.env.NODE_ENV !== "production";
  }

  try {
    jwks ??= createRemoteJWKSet(
      new URL(`${teamDomain}/cdn-cgi/access/certs`),
    );
    await jwtVerify(token, jwks, {
      issuer: teamDomain,
      audience: audiences,
    });
    return true;
  } catch {
    return false;
  }
}
