import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
        <Sidebar />
      
      <main className="flex-1 p-5">{children}</main>
    </div>
  );
}
