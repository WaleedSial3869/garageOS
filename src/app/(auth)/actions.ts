"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  redirect("/")
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const shopName = formData.get("shopName") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Failed to create user" }
  }

  // 2. Create shop
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .insert({
      name: shopName,
      currency: "CAD",
      timezone: "America/Toronto",
      tax_rate: 0.13,
      labor_rate: 120.0,
    })
    .select()
    .single()

  if (shopError) {
    return { error: shopError.message }
  }

  // 3. Create team member (owner)
  const { error: memberError } = await supabase.from("team_members").insert({
    shop_id: shop.id,
    auth_user_id: authData.user.id,
    first_name: firstName,
    last_name: lastName,
    email,
    role: "owner",
  })

  if (memberError) {
    return { error: memberError.message }
  }

  redirect("/")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
