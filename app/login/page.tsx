import LoginForm from '@/components/auth/LoginForm'
import AuthLayout from '@/components/layout/AuthLayout'

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="container mx-auto max-w-md mt-10">
        <h1 className="text-2xl font-bold mb-5">Log In</h1>
        <LoginForm />
      </div>
    </AuthLayout>
  )
}
