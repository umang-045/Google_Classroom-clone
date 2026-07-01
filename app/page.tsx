
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route" 
import LandingPage from "@/app/components/LandingPage/LandingPage"

export default async function Page() {
 
  const session = await getServerSession(authOptions)

  return <LandingPage />
}