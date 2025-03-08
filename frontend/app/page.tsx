import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import LoginPage from "./(auth)/login/page"

export default async function Home() {
  // Check if user is already logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // If token exists, redirect to dashboard
  if (token) {
    redirect("/dashboard");
  }

  // Otherwise, show login page
  return <LoginPage />;
}

