import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { getAdminAccessFlags, resolveRoleLabel } from "../../lib/adminRoles";

const AdminSidebar = () => {
  const { user, roles } = useAppContext();
  const roleLabel = resolveRoleLabel(roles);
  const { canManageBusiness, canManageSiteOps, isSysOrAdmin } =
    getAdminAccessFlags(roles);

  const adminNavlinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboardIcon,
      visible: isSysOrAdmin || canManageBusiness
    },
    {
      name: "Add Destinations",
      path: "/admin/add-destinations",
      icon: PlusSquareIcon,
      visible: isSysOrAdmin || canManageSiteOps
    },
    {
      name: "List Destinations",
      path: "/admin/list-destinations",
      icon: ListIcon,
      visible: isSysOrAdmin || canManageSiteOps
    },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
      visible: isSysOrAdmin || canManageBusiness
    }
  ].filter((link) => link.visible);

  const primaryLabel = roleLabel || "Admin User";
  const secondaryLabel = user?.emailAddresses?.[0]?.emailAddress || " ";

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      {/* <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={user.imageUrl} alt="sidebar" /> */}
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
        src={user?.imageUrl || assets.visitCeylonLogo}
        alt="sidebar"
      />
      <p className="mt-2 text-base max-md:hidden">{primaryLabel}</p>
      <p className="text-xs text-primary max-md:hidden">{secondaryLabel}</p>
      <div className="w-full">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${
                isActive && "bg-primary/15 text-primary group"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <p className="max-md:hidden">{link.name}</p>
                <span
                  className={`w-1.5 h-10 rounded-l right-0 absolute ${
                    isActive && "bg-primary"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
