"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
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
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Se estiver na página de login, não aplicar autenticação
  if (pathname === '/admin/login') {
    return children;
  }

  useEffect(() => {
    // Verificar se está no cliente antes de acessar localStorage
    if (typeof window === 'undefined') {
      return;
    }

    // Aguardar um pouco para garantir que o componente foi hidratado
    const timer = setTimeout(() => {
      // Verificar se o admin está autenticado via localStorage
      const adminAuth = localStorage.getItem('admin_authenticated');
      const authTime = localStorage.getItem('admin_auth_time');
      
      if (adminAuth === 'true' && authTime) {
        // Verificar se a autenticação não expirou (24 horas)
        const authTimestamp = parseInt(authTime);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (now - authTimestamp < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Autenticação expirou
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_auth_time');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated === false && !isLoading && typeof window !== 'undefined') {
      console.log('Forcing redirect to login...');
      window.location.href = "/admin/login";
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div>Carregando admin...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div>Redirecionando para login...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Admin Panel</h1>
      </div>
      
      <div style={{ padding: '20px' }}>
        {children}
      </div>
      
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <button 
          onClick={() => {
            localStorage.removeItem('admin_authenticated');
            localStorage.removeItem('admin_auth_time');
            window.location.href = '/admin/login';
          }}
          style={{ background: '#dc2626', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}