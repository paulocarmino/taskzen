import AuthTemplate from '@/components/templates/AuthTemplate';
import SignupForm from '@/components/auth/SignupForm';
import { ListTodo } from 'lucide-react';

export default function SignupPage() {
  return (
    <AuthTemplate>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="flex items-center mb-8">
          <ListTodo className="h-10 w-10 text-brand-600 mr-2" />
          <h1 className="text-3xl font-bold text-slate-800">TaskZen</h1>
        </div>
        <SignupForm />
      </div>
    </AuthTemplate>
  );
}
