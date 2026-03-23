import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session) {
    redirect("/login?callbackUrl=%2Fprofile");
  }

  return <ProfileClient />;
}
