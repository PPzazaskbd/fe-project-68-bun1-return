export default async function getUserProfile(token: string) {
  const res = await fetch("https://backend-for-frontend-bun1.vercel.app/api/v1/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}