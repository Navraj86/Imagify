import { Geist, Instrument_Serif } from 'next/font/google';
import AppContextProvider from '@/context/AppContext';
import { Toaster } from '@/components/ui/sonner';
import App from '@/App';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
});

export const metadata = {
  title: {
    default: 'Imagify | Text to image generator',
    template: '%s · Imagify',
  },
  description: 'Generate images from text prompts. New accounts get 5 free credits.',
};

export const viewport = {
  themeColor: '#07070a',
  colorScheme: 'dark',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`dark ${geist.variable} ${instrumentSerif.variable}`}>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) inject attributes into <body> */}
      <body suppressHydrationWarning>
        <AppContextProvider>
          <App>{children}</App>
        </AppContextProvider>
        <Toaster position='bottom-right' richColors closeButton />
      </body>
    </html>
  )
};

export default RootLayout;
