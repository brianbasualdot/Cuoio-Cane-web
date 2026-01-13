import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Users, FileText, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cuoio Cane Admin',
  description: 'Panel de Administración',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If middleware misses, or checking inside layout for double safety on login page exclusion?
    // Actually, middleware handles redirects.
    // If this layout wraps login page, we have an issue.
    // Ideally Login has its own layout or we conditionally render sidebar.
  }

  // Since App Router applies RootLayout to EVERYTHING including login unless we use Route Groups,
  // we should check if we are on Login or just render Sidebar only if user exists?
  // Easier: Use Route Groups: (auth)/login and (dashboard)/*

  // But for speed without refactoring folder structure too much:
  // We can just render children if no user (Login page logic), or rely on the Fact that Login Page is wrapped.

  // WAIT: The Login Page is at /login.
  // The Middleware ensures authorized users allow /.
  // If I put Sidebar here, it shows on Login too unless I conditional check.

  // Let's do a simple conditional.
  const isLoginPage = !user; // Middleware handles redirection logic, so if we are here and !user, we must be on /login.

  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-gray-50 flex`}>
        {user && (
          <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col fixed h-full z-10">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
              <span className="font-bold text-white tracking-widest">CUOIO ADMIN</span>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <NavLink href="/" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink href="/orders" icon={ShoppingBag}>Ventas</NavLink>
              <NavLink href="/products" icon={Package}>Productos</NavLink>
              <NavLink href="/customers" icon={Users}>Clientes</NavLink>
              <NavLink href="/shipments" icon={Package}>Envíos</NavLink>

              <div className="pt-8 pb-2 px-3 text-xs font-semibold uppercase text-gray-500">Sistema</div>
              <NavLink href="/staff" icon={Settings}>Staff</NavLink>
              <NavLink href="/audit" icon={FileText}>Audit Logs</NavLink>
            </nav>
            <div className="p-4 border-t border-gray-800">
              <form action="/auth/signout" method="post">
                <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium hover:text-white transition-colors w-full text-left">
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </aside>
        )}

        <main className={`flex-1 ${user ? 'ml-64' : ''}`}>
          {children}
        </main>
      </body>
    </html>
  );
}

function NavLink({ href, icon: Icon, children }: any) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-white transition-colors">
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  );
}
