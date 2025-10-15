'use client';

import { useAuth } from '../../lib/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !hasRole(['USER', 'ADMIN']))) {
      router.push('/');
    }
  }, [user, loading, hasRole, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !hasRole(['USER', 'ADMIN'])) {
    return <div>Access denied. User or Admin role required.</div>;
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.name}! User ID: {user.userId}</p>
      <p>Your role: {user.role}</p>
      {/* User-specific content */}
    </div>
  );
}