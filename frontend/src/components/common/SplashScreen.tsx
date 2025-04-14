import React from 'react';
import { ListTodo } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="animate-bounce">
          <ListTodo className="w-16 h-16 text-brand-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">TaskZen</h1>
        <div className="w-48">
          <Skeleton className="w-full h-2 mb-2" />
          <Skeleton className="w-3/4 h-2" />
        </div>
      </div>
    </div>
  );
}
