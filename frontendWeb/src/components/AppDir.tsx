'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useState } from 'react';

export function AppDirProvider({ 
  children, 
  messages 
}: { 
  children: React.ReactNode;
  messages: any;
}) {
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}