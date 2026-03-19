"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("LOGIN RESULT:", res);

    if (!res?.error) {
      router.push("/"); 
    } else {
      alert("ไม่สำเร็จ หว่ายๆ");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <h1 className="bg-blue-700 text-2xl font-bold ">Sign In</h1>

      <input
        type="text"
        placeholder="Email"
        className="border p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}