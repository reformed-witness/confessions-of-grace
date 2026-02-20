"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface AdminSidebarProps {
  role: string;
}

const navItems = [
  { label: "Dashboard", href: "/admin", minRole: "editor" },
  { label: "Posts", href: "/admin/posts", minRole: "editor" },
  { label: "Comments", href: "/admin/comments", minRole: "editor" },
  { label: "Subscriptions", href: "/admin/subscriptions", minRole: "admin" },
  { label: "Authors", href: "/admin/authors", minRole: "admin" },
  { label: "Admin Users", href: "/admin/users", minRole: "super_admin" },
];

const roleHierarchy: Record<string, number> = {
  editor: 1,
  admin: 2,
  super_admin: 3,
};

export default function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const userLevel = roleHierarchy[role] || 0;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="text-lg font-bold">
          Confessions of Grace
        </Link>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems
            .filter((item) => userLevel >= (roleHierarchy[item.minRole] || 0))
            .map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <p className="text-gray-400 text-xs mb-2 capitalize">
          Role: {role.replace("_", " ")}
        </p>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
