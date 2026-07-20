import { Outlet } from "react-router";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";

export default function DashboardLayout() {
  return (
    <div className="bg-muted/30 flex min-h-screen w-full">
      <Sidebar />
      <div className="ml-64 flex w-[calc(100%-16rem)] flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
