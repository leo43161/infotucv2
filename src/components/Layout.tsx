// src/components/Layout.tsx
import { cn } from '@/utils';
import { type ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface Props {
  children: ReactNode;
  className?: string;
}


const Layout = ({ children, className }: Props) => {
  return (
    <div className={cn("h-full flex flex-col overflow-hidden bg-gray-100", className ?? '')}>
      <Header />
      <main className="flex-grow overflow-y-auto relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;