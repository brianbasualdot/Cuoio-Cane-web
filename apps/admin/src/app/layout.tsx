import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Users, FileText, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

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

  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex selection:bg-[var(--accent-copper)] selection:text-black`}>
        {user && (
          <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col fixed h-full z-10">
            <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
              <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] tracking-[0.25em] uppercase hover:text-[var(--accent-copper)] transition-colors duration-300 cursor-default">
                CUOIO ADMIN
              </span>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <NavLink href="/" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink href="/orders" icon={ShoppingBag}>Ventas</NavLink>
              <NavLink href="/products" icon={Package}>Productos</NavLink>
              <NavLink href="/customers" icon={Users}>Clientes</NavLink>
              <NavLink href="/shipments" icon={Package}>Envíos</NavLink>

              <div className="pt-8 pb-4 px-3 text-[9px] font-mono font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50">Sistema</div>
              <NavLink href="/staff" icon={Settings}>Staff</NavLink>
              <NavLink href="/audit" icon={FileText}>Logs</NavLink>
            </nav>
            <div className="p-4 border-t border-[var(--border)]">
              <form action="/auth/signout" method="post">
                <button className="flex items-center gap-3 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-full text-left group">
                  <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  Salir
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
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-all duration-300"
    >
      <Icon className="w-4 h-4 opacity-60" />
      {children}
    </Link>
  );
}
