import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React from 'react'

const Navigation = ({href, text}) => {
    return (
        <Link href={`/${href}`} className="text-pink-400 hover:underline mb-4 inline-flex items-center gap-2">
            <ArrowLeftIcon className="h-5 w-5" />
            {text}
        </Link>
    )
}

export default Navigation