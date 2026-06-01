import { lazy, Suspense, useEffect } from "react";
import PublicSite from "./components/PublicSite";

const AdminPanel = lazy(() => import("./components/AdminPanel"));

function isAdminRoute() {
  return window.location.pathname.replace(/\/+$/, "").endsWith("/admin");
}

export default function App() {
  const adminRoute = isAdminRoute();

  useEffect(() => {
    document.body.classList.toggle("admin-page", adminRoute);
    return () => document.body.classList.remove("admin-page");
  }, [adminRoute]);

  return adminRoute ? (
    <Suspense fallback={<main className="admin-login"><article className="admin-login-card">Yüklənir...</article></main>}>
      <AdminPanel />
    </Suspense>
  ) : <PublicSite />;
}
