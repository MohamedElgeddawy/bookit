import { Inter } from 'next/font/google';
import '@/assets/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthWrapper from '@/components/AuthWrapper';
import { ThemeProvider } from '@/context/themeContext';
import { ToastContainer } from 'react-toastify';
import '@/assets/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Bookit App | Book a Room',
  description: 'Book a Room for your next meeting or event',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthWrapper>
            <Header />
            <main className="max-w-7xl mx-auto px-6 sm:px-6 md:px-8 bg-white dark:bg-gray-900 min-h-screen">
              {children}
            </main>
            <Footer />
            <ToastContainer />
          </AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
