"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { IoMdArrowRoundBack } from "react-icons/io";

const Navigation = () => {
    const router = useRouter()

    const handleNavigate = (e) => {
        e.preventDefault()
        router.back()
    }

    return (
        <button className='text-pink-500 flex justify-center items-center gap-2 hover:text-pink-400 cursor-pointer' onClick={handleNavigate}><IoMdArrowRoundBack size={30}/>Kembali</button>
    )
}

export default Navigation