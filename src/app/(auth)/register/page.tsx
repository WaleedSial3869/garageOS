"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validators"
import { register as registerAction } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.set("shopName", data.shopName)
    formData.set("firstName", data.firstName)
    formData.set("lastName", data.lastName)
    formData.set("email", data.email)
    formData.set("password", data.password)

    const result = await registerAction(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="tonal-card rounded-xl p-8 shadow-ambient">
      <h2 className="text-xl font-bold text-on-surface mb-1">
        Create your shop
      </h2>
      <p className="text-sm text-on-surface-variant mb-6">
        Set up GarageOS for your auto repair shop
      </p>

      {error && (
        <div className="bg-error-container text-on-error-container text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shopName">Shop Name</Label>
          <Input
            id="shopName"
            placeholder="Your Auto Repair Shop"
            {...register("shopName")}
          />
          {errors.shopName && (
            <p className="text-xs text-error">{errors.shopName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-error">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-error">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@yourshop.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating shop..." : "Create Shop & Get Started"}
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-variant mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
