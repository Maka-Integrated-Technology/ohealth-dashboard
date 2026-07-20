import { Outlet } from "react-router";
import { Sidebar } from "~/features/dashboard/components/sidebar";
import { Header } from "~/features/dashboard/components/header";

export default function MpDashboardLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
