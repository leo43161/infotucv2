// src/components/Layout.tsx
import React, { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-100">
      <Header />
      <main className="flex-grow overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;