"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";

const inter = Inter({ subsets: ["latin"] });

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/produtos", label: "Produtos", icon: "📱" },
  { href: "/admin/categorias", label: "Categorias", icon: "🏷️" },
  { href: "/admin/kits", label: "Kits", icon: "📦" },
  { href: "/admin/relatorios", label: "Relatórios", icon: "📈" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
            {/* Logo */}
            <div className="flex items-center justify-center h-16 bg-gray-50 border-b">
              <span className="text-xl font-semibold text-gray-800">
                Admin Panel
              </span>
            </div>

            {/* Navigation */}
            <nav className="mt-8">
              <div className="px-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:pl-64">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm border-b">
              <div className="flex items-center justify-between px-4 py-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Page title */}
                <h1 className="text-xl font-semibold text-gray-800">
                  Admin
                </h1>

                <div></div> {/* Spacer for flexbox balance */}
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block">
              <AdminHeader />
            </div>

            {/* Page Content */}
            <main className="p-6">
              {children}
            </main>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
    </div>
  );
}