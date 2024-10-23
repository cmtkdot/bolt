import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import AuthLayout from '@/components/layout/AuthLayout'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="container mx-auto max-w-md mt-10">
        <h1 className="text-2xl font-bold mb-5">Forgot Password</h1>
        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  )
}
