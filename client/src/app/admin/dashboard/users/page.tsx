"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  userId: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/admin/users", {
          credentials: "include",
        });

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleView = (id: number) => {
    router.push(`/admin/dashboard/users/${id}`);
  };

  return (
    <div className="min-h-screen  text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <div className="overflow-x-auto bg-[#1e293b] rounded-xl shadow-lg">
        <table className="w-full">
          <thead className="bg-[#334155] text-gray-300 text-sm uppercase">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.userId}
                className={`border-t border-gray-700 hover:bg-[#334155] transition ${
                  index % 2 === 0 ? "bg-[#1e293b]" : "bg-[#0f172a]"
                }`}
              >
                <td className="p-4 font-medium">{user.name}</td>

                <td className="p-4 text-gray-300">{user.email}</td>

                <td className="p-4">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                    {user.role}
                  </span>
                </td>

                <td className="p-4 text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => handleView(user.userId)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 px-4 py-1.5 rounded-lg text-sm font-medium"
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center py-6 text-gray-400">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}