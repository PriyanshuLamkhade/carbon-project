import UserSidebar from "../../components/UserSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-200">
      
        <UserSidebar />
      
      <main className="flex-1 p-5">{children}</main>
    </div>
  );
}
