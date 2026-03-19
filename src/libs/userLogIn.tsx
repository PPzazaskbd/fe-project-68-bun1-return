export default async function userLogIn(email: string, password: string) {
  const res = await fetch("https://a08-venue-explorer-backend.vercel.app/api/v1/auth/login", {
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