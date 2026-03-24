import { buildBackendUrl } from "@/libs/backendApiBase";

export default async function getUserProfile(token: string) {
  const res = await fetch(buildBackendUrl("/auth/me"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return await res.json();
}
