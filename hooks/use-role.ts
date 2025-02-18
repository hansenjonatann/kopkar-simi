import { useSession } from "next-auth/react";

export function useRole () {
    const {data: session , status} = useSession()

    const role = session?.user.role || 'USER'

    return {role , isLoading: status === 'loading'}
}