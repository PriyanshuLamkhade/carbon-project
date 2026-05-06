import UserSidebar from "@/components/layout/sidebars/UserSidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-200">
      
        <UserSidebar />
      
      {/* <main className="flex-1 p-5"> */}
        <main className="flex-1 p-5 ml-[17vmax] text-white/90">
        {children}</main>
    </div>
  );
}
