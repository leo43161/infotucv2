// src/components/Layout.tsx
import { cn } from '@/utils';
import { useState, type ReactNode, useEffect } from 'react'; // <-- 1. Importa hooks
import { useRouter } from 'next/router'; // <-- 2. Importa el router
import Footer from './Footer';
import Header from './Header';
import LayoutWayki from './layoutWayki/LayoutWayki';
import { getData, saveData } from '@/utils/indexedDB';
import { useDispatch } from 'react-redux';
import { closeWaykiLayout, openWaykiItinerario, openWaykiLayout } from '@/store/features/uiSlice';

interface Props {
  children: ReactNode;
  className?: string;
}

const LAYOUT_WAYKI_DISMISSED_KEY = 'waykiDismissed';

const Layout = ({ children, className }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkWaykiDismissed = async () => {
      const dismissed = await getData(LAYOUT_WAYKI_DISMISSED_KEY);
      if (!dismissed && router.pathname === '/') {
        dispatch(openWaykiLayout());
      } else {
        dispatch(closeWaykiLayout());
      }
    }
    checkWaykiDismissed();
  }, [router.pathname]);

  const handleWaykiDismiss = async () => {
    await saveData(LAYOUT_WAYKI_DISMISSED_KEY, 'true', 120 * 60 * 60);
    dispatch(closeWaykiLayout());
    dispatch(openWaykiItinerario());
  };

  return (
    <div className={cn("h-full flex flex-col overflow-hidden bg-gray-100", className ?? '')}>
      {/* <LayoutWayki onSkip={handleWaykiDismiss} /> */}
      <Header />
      <main className="flex-grow overflow-y-auto relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;