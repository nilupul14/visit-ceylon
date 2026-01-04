import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  canAccessAdminPath,
  getDefaultAdminPath
} from "../../lib/adminRoles";

const Layout = () => {
  const { isAdmin, fetchIsAdmin, roles, rolesLoaded } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchIsAdmin();
  }, []);

  useEffect(() => {
    if (!isAdmin || !rolesLoaded) return;

    if (!canAccessAdminPath(roles, location.pathname)) {
      const fallbackPath = getDefaultAdminPath(roles);
      navigate(fallbackPath, { replace: true });
    }
  }, [isAdmin, roles, location.pathname, navigate]);

  if (!rolesLoaded) {
    return <Loading />;
  }

  return isAdmin ? (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Layout;
