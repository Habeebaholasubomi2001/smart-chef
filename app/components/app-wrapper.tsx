'use client';

import { ModelProvider } from '../context/ModelContext';
import Navbar from './navbar';
import Footer from './footer';
import { ReactNode } from 'react';

export default function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <ModelProvider>
      <Navbar />
      {children}
      <Footer />
    </ModelProvider>
  );
}