'use server';

import { prisma } from '@/lib/prisma';

interface FooterData {
  websiteConfig: {
    siteName: string;
    tagline?: string | null;
    description?: string | null;
    companyName: string;
    primaryPhone?: string | null;
    primaryEmail?: string | null;
    bookingEmail?: string | null;
    supportEmail?: string | null;
    headquarters?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    twitterUrl?: string | null;
    youtubeUrl?: string | null;
    linkedinUrl?: string | null;
    privacyPolicyUrl?: string | null;
    termsOfServiceUrl?: string | null;
    cookiePolicyUrl?: string | null;
  } | null;
  businessUnits: {
    id: string;
    name: string;
    slug: string;
    city: string;
    country: string;
    phone?: string | null;
    email?: string | null;
  }[];
  quickLinks: {
    name: string;
    href: string;
  }[];
}

export async function getFooterData(): Promise<FooterData> {
  try {
    const [websiteConfig, businessUnits] = await Promise.all([
      // Get website configuration
      prisma.websiteConfiguration.findFirst({
        select: {
          siteName: true,
          tagline: true,
          description: true,
          companyName: true,
          primaryPhone: true,
          primaryEmail: true,
          bookingEmail: true,
          supportEmail: true,
          headquarters: true,
          facebookUrl: true,
          instagramUrl: true,
          twitterUrl: true,
          youtubeUrl: true,
          linkedinUrl: true,
          privacyPolicyUrl: true,
          termsOfServiceUrl: true,
          cookiePolicyUrl: true,
        },
      }),

      // Get active business units
      prisma.businessUnit.findMany({
        where: {
          isActive: true,
          isPublished: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          country: true,
          phone: true,
          email: true,
        },
        orderBy: {
          name: 'asc',
        },
        take: 6, // Limit to 6 properties in footer
      }),
    ]);

    // Define quick links based on common hotel website sections
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

    return {
      websiteConfig,
      businessUnits,
      quickLinks,
    };
  } catch (error) {
    console.error('Error fetching footer data:', error);
    
    // Return fallback data
    return {
      websiteConfig: null,
      businessUnits: [],
      quickLinks: [
        { name: 'Home', href: '/' },
        { name: 'Properties', href: '/properties' },
        { name: 'Contact', href: '/contact' },
      ],
    };
  }
}