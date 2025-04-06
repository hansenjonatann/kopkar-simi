import { useSession } from "next-auth/react";

export function useRole() {
  const { data: session, status } = useSession();

  const role = session?.user.role || "USER";
  const name = session?.user.name;

  return { role, isLoading: status === "loading", name };
}
