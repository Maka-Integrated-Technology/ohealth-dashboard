import { Outlet } from "react-router";

// The laboratory sign-in experience owns its own full-screen split layout.
// Keep the shared authenticated app shell for the future dashboard routes.
export default function LaboratoryPortalLayout() {
  return <Outlet />;
}
