import type {Metadata} from 'next';
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
