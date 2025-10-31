// src/components/Layout.tsx
import { cn } from '@/utils';
import { useState, type ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import LayoutWayki from './layoutWayki/LayoutWayki';

interface Props {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={cn("h-full flex flex-col overflow-hidden bg-gray-100", className ?? '')}>
      <LayoutWayki show={isOpen} />
      <Header />
      <main className="flex-grow overflow-y-auto relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;