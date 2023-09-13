"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routes = [
    {
        href:`/${params.storeId}`,
        label: 'Resumen',
        active: pathname === `/${params.storeId}`,
    },
    {
        href:`/${params.storeId}/eventos`,
        label: 'Eventos',
        active: pathname === `/${params.storeId}/eventos`,
    },
    {
        href:`/${params.storeId}/destacados`,
        label: 'Destacado',
        active: pathname === `/${params.storeId}/destacados`,
    },
    {
        href:`/${params.storeId}/categories`,
        label: 'Categoria',
        active: pathname === `/${params.storeId}/categories`,
    },
    {
        href:`/${params.storeId}/fechas`,
        label: 'Fecha',
        active: pathname === `/${params.storeId}/fechas`,
    },
    {
        href:`/${params.storeId}/ubicacions`,
        label: 'Ubicacion',
        active: pathname === `/${params.storeId}/ubicacions`,
    },
    {
        href:`/${params.storeId}/orders`,
        label: 'Ordenes',
        active: pathname === `/${params.storeId}/orders`,
    },
    {
    href:`/${params.storeId}/settings`,
    label: 'Configuracion',
    active: pathname === `/${params.storeId}/settings`,
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden text-sm font-medium transition-colors hover:text-primary"
      >
        Menu
      </button>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-12 left-0 right-0 bg-white dark:bg-gray-800 border rounded-md shadow-lg">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block py-2 px-4 text-sm font-medium transition-colors hover:text-primary',
                route.active
                  ? 'text-black dark:text-white'
                  : 'text-muted-foreground'
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex space-x-4"> {/* Add space between desktop links */}
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary px-2 py-1', // Add padding to desktop links
              route.active
                ? 'text-black dark:text-white'
                : 'text-muted-foreground'
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}