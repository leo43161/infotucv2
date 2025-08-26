// src/components/Layout.tsx
import React, { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface Props {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: Props) => {
  return (
    <div className={"h-full flex flex-col overflow-hidden bg-gray-100 " + className}>
      <Header />
      <main className="flex-grow overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;