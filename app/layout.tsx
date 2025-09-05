import "./globals.css";
import Header from '@/components/header';
import Footer from "@/components/footer";
import { CssBaseline } from '@mui/material';
import { getWebsiteConfiguration } from "@/lib/website-config";
import { getBusinessUnits } from "@/lib/actions/business-units";

export const metadata = {
  title: "Tropicana Worldwide Corp.",
  description: "Hotel Management & CMS for TWC",
};

export const viewport = {
  themeColor: '#0a0e13',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use your existing server actions
  const [websiteConfig, businessUnits] = await Promise.all([
    getWebsiteConfiguration(),
    getBusinessUnits(),
  ]);

  // Define quick links for footer navigation
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Reservations', href: '/reservations' },
    { name: 'Special Offers', href: '/offers' },
    { name: 'Events', href: '/events' },
    { name: 'Restaurants', href: '/dining' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <html lang="en">
      <body style={{ backgroundColor: '#000000', color: '#e2e8f0' }}>
        <CssBaseline />
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          backgroundColor: '#000000',
        }}>
          <Header businessUnits={businessUnits} websiteConfig={websiteConfig} />
          
          <main style={{ flex: 1, paddingTop: '70px' }}>
            {children}
          </main>
          
          <Footer
            websiteConfig={websiteConfig}
            businessUnits={businessUnits}
            quickLinks={quickLinks}
          />
        </div>
      </body>
    </html>
  );
}