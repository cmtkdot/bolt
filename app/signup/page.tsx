import SignUpForm from '@/components/auth/SignUpForm'
import AuthLayout from '@/components/layout/AuthLayout'

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="container mx-auto max-w-md mt-10">
        <h1 className="text-2xl font-bold mb-5">Sign Up</h1>
        <SignUpForm />
      </div>
    </AuthLayout>
  )
}
