"use client"
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navigation = () => {

    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    return (
        <button onClick={handleBack} className="text-pink-400 hover:underline mb-4 inline-flex items-center gap-2 cursor-pointer">
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali
        </button>
    )
}

export default Navigation