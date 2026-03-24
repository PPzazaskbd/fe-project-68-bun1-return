import { buildBackendUrl } from "@/libs/backendApiBase";

export default async function userLogIn(email: string, password: string) {
  const res = await fetch(buildBackendUrl("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return await res.json();
}
// TODO:
