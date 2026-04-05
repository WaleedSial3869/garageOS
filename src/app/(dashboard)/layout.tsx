import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let userName = "User"

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: member } = await supabase
        .from("team_members")
        .select("first_name, last_name")
        .eq("auth_user_id", user.id)
        .single()

      if (member) {
        userName = `${member.first_name} ${member.last_name.charAt(0)}.`
      }
    }
  } catch {
    // Supabase not configured yet — use fallback
  }

  return (
    <>
      <TopNav userName={userName} />
      <div className="flex">
        <Sidebar />
        <main className="ml-16 w-full min-h-screen p-8 transition-all duration-300">
          {children}
        </main>
      </div>
    </>
  )
}
