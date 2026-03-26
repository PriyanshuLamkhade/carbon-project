import ValidatorSidebar from "@/components/layout/sidebars/ValidatorSidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black/70 ">
      
        <ValidatorSidebar />
      
      <main className="flex-1 p-5 text-white/90">{children}</main>
    </div>
  );
}
