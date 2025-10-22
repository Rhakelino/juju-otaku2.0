import Link from 'next/link'
import { AuthUserSession } from '../libs/auth-libs'


const UserActionButton = async () => {
    const user = await AuthUserSession()
    const actionLabel = user ? "Logout" : "Login"
    const actionHref = user ? "/api/auth/signout" : "/api/auth/signin"
    const bgButton = user ? "bg-red-500" : "bg-green-500"


    return (
        <div className='grid grid-cols-2 items-center gap-3'>
            {user ? (
                <Link href="/users/dashboard" className={`bg-yellow-500 text-center text-white px-6 py-2 md:py-3 rounded-full mt-3`}>Dashboard</Link>
            ) : null}
            <Link href={actionHref} className={`${bgButton} text-center text-white px-6 py-2 md:py-3 rounded-full mt-3`}>
                {actionLabel}
            </Link>
        </div>
    )
}

export default UserActionButton