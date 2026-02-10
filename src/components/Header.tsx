'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { data: session } = useSession();
  const { cartCount } = useCart();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Vya Nexus
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            {session ? (
              <Link href="/profile" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Perfil
              </Link>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Entrar
              </Link>
            )}
            <Link href="/cart" className="relative cursor-pointer group flex items-center">
              <span className="text-gray-600 group-hover:text-blue-600">
                🛒 Carrinho
              </span>
              {cartCount > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="md:hidden">
            <Link href="/cart" className="relative p-2">
              🛒
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] rounded-full px-1 min-w-[1rem] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
