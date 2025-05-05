
import { Poppins } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast'
import QueryProvider from '@/provider/QueryProvider';
import ProtectedLayout from './(protected)/layout';
import { TopupProvider } from '@/context/TopupContext';
import { PurchaseProvider } from '@/context/PurchaseContext';
// import { PaymentProvider } from '@/context/PaymentContext';

const poppins = Poppins({
  subsets: ['latin'], // ✅ yang benar
  weight: ['300', '400', '500', '600', '700'], // optional, sesuai kebutuhan
  display: 'swap', // optional tapi direkomendasikan untuk kinerja lebih baik
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} dark:bg-gray-900 bg-white`}>
        <ProtectedLayout>
          <Toaster position="top-right" reverseOrder={false} />
          <QueryProvider>
            <TopupProvider>
              <PurchaseProvider>
                {/* <PaymentProvider> */}
                  <ThemeProvider>
                    <SidebarProvider>{children}</SidebarProvider>
                  </ThemeProvider>
                {/* </PaymentProvider> */}
              </PurchaseProvider>
            </TopupProvider>
          </QueryProvider>
        </ProtectedLayout>
      </body>
    </html>
  );
}
