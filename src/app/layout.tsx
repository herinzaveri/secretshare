import type {Metadata} from 'next';
import './globals.css';
import {Inter} from 'next/font/google';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
const inter = Inter({subsets: ['latin'], variable: '--font-inter'});

export const metadata: Metadata = {
  title: {
    default: 'Secret Share | Herin Zaveri',
    template: '%s | Herin Zaveri',
  },
  // eslint-disable-next-line max-len
  description: `This is an app to share secrets`,
  icons: {
    icon: '/favicon.png',
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={inter.variable}>
      <head />
      <body className="relative min-h-screen bg-black bg-gradient-to-tr from-zinc-900/50 to-zinc-700/30">
        {
          // Not everyone will want to host secretshare on Vercel, so it makes sense to make this opt-in.
          // process.env.ENABLE_VERCEL_ANALYTICS ? <Analytics /> : null
        }

        <Header />

        <main className=" min-h-[80vh] ">{children}</main>

        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
