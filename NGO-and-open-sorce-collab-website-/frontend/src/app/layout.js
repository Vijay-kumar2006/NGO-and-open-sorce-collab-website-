import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'NGO Pipeline Hub',
  description: 'Transparent contribution pipelines for NGOs and contributors.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] bg-soft">
          {children}
        </main>
        <footer className="border-t border-soft-200 bg-white py-8">
          <div className="container flex flex-col items-center gap-2 text-center text-sm text-ink-muted sm:flex-row sm:justify-between">
            <p>&copy; {new Date().getFullYear()} NGO Pipeline Hub. All rights reserved.</p>
            <p>Built for transparent collaboration.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
