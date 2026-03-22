export default async function userLogIn(email: string, password: string) {
  const res = await fetch("https://backend-for-frontend-bun1.vercel.app/api/v1/auth/login", {
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