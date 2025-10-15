'use client';

import { useAuth } from '../../lib/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !hasRole(['ADMIN']))) {
      router.push('/');
    }
  }, [user, loading, hasRole, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !hasRole(['ADMIN'])) {
    return <div>Access denied. Admin role required.</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! User ID: {user.userId}</p>
      <p>Role: {user.role}</p>
      {/* Admin-specific content */}
    </div>
  );
}