import { getServerSession } from 'next-auth'
import { authOption } from '../api/auth/[...nextauth]/route'

export const AuthUserSession = async () => {
    const session = await getServerSession(authOption)
    return session?.user
}
