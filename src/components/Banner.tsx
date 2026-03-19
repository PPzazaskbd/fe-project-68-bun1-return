"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function Banner(){

  const { data: session } = useSession()

  const images = [
    "/img/cover.jpg",
    "/img/cover2.jpg",
    "/img/cover3.jpg",
    "/img/cover4.jpg"
  ]

  const [index,setIndex] = useState(0)

  function changeImage(){
    setIndex((index+1)%images.length)
  }

  return(
    <div className="relative w-full h-[400px]">

      {/* 🔥 Welcome */}
      {session?.user && (
        <div className="absolute top-3 right-5 z-10 bg-black/50 px-4 py-1 rounded text-white">
          Welcome {session?.user?.name}
        </div>
      )}

      <img
        src={images[index]}
        onClick={changeImage}
        className="w-full h-full object-cover cursor-pointer"
      />

      <Link href="/venue">
        <button
          className="absolute bottom-5 right-5 bg-red-500 px-5 py-2 rounded-lg shadow-md hover:bg-blue-400 text-white"
        >
          ลองเอาเมาส์มาชี้ดูสิ~
        </button>
      </Link>

    </div>
  )
}