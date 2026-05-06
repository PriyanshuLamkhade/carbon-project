import AdminSidebar from "@/components/layout/sidebars/AdminSidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black/70 ">
      <AdminSidebar/>
        
      
      <main className="flex-1 p-5 ml-[17vmax] text-white/90">{children}</main>
    </div>
  );
}
