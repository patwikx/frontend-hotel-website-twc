'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  LinkedIn,
  Handshake,
  CardGiftcard,
  Spa,
  Work,
  Newspaper,
  Map,
  Accessible,
  Send,
  Home,
  Hotel,
  Event,
  LocalDining,
  Info,
  ContactPage,
  RoomService,
  Discount,
  ConfirmationNumber,
  HouseRounded,
} from '@mui/icons-material';

// Refined minimal theme
const theme = {
  background: '#000000',
  surface: '#0a0a0a',
  primary: '#ffffff',
  text: '#ffffff',
  textSecondary: '#999999',
  textMuted: '#666666',
  border: '#1a1a1a',
  accent: '#333333',
};

interface FooterProps {
  websiteConfig: {
    siteName: string;
    tagline?: string | null;
    description?: string | null;
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
    displayName: string;
    slug: string;
    city: string;
    country: string;
    phone?: string | null;
    email?: string | null;
    icon?: React.ReactNode;
  }[];
  quickLinks: {
    name: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

const Footer: React.FC<FooterProps> = ({ websiteConfig, businessUnits, quickLinks }) => {
  const currentYear = new Date().getFullYear();
  const companyName = websiteConfig?.siteName || websiteConfig?.siteName || 'Tropicana Worldwide Corporation';
  const siteName = websiteConfig?.siteName || 'TROPICANA WORLDWIDE CORPORATION';

  // We are now directly using the props, but adding mock icons to fill the UI
  // if the original data doesn't have them.
  const populatedQuickLinks = quickLinks.length > 0 ? quickLinks.map(link => ({
    ...link,
    icon: link.icon || (() => {
      switch (link.name) {
        case 'Home': return <Home sx={{ fontSize: 14, mr: 1 }} />;
        case 'Properties': return <Hotel sx={{ fontSize: 14, mr: 1 }} />;
        case 'Reservations': return <ConfirmationNumber sx={{ fontSize: 14, mr: 1 }} />;
        case 'Special Offers': return <Discount sx={{ fontSize: 14, mr: 1 }} />;
        case 'Events': return <Event sx={{ fontSize: 14, mr: 1 }} />;
        case 'Restaurants': return <LocalDining sx={{ fontSize: 14, mr: 1 }} />;
        case 'About Us': return <Info sx={{ fontSize: 14, mr: 1 }} />;
        case 'Contact': return <ContactPage sx={{ fontSize: 14, mr: 1 }} />;
        default: return null;
      }
    })()
  })) : [
    { name: 'Home', href: '/', icon: <Home sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Properties', href: '/properties', icon: <Hotel sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Reservations', href: '/reservations', icon: <ConfirmationNumber sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Special Offers', href: '/offers', icon: <Discount sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Events', href: '/events', icon: <Event sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Restaurants', href: '/restaurants', icon: <LocalDining sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'About Us', href: '/about', icon: <Info sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Contact', href: '/contact', icon: <ContactPage sx={{ fontSize: 14, mr: 1 }} /> },
  ];

  const populatedBusinessUnits = businessUnits.length > 0 ? businessUnits.map(unit => ({
    ...unit,
    icon: unit.icon || <HouseRounded sx={{ fontSize: 14, mr: 1 }} />
  })) : [
    { id: '1', name: 'Anchor Hotel', slug: 'anchor-hotel', city: 'General Santos City', country: 'Philippines', icon: <HouseRounded sx={{ fontSize: 14, mr: 1 }} /> },
    { id: '2', name: 'Dolores Farm Resort', slug: 'dolores-farm-resort', city: 'General Santos City', country: 'Philippines', icon: <RoomService sx={{ fontSize: 14, mr: 1 }} /> },
    { id: '3', name: 'Dolores Lake Resort', slug: 'dolores-lake-resort', city: 'General Santos City', country: 'Philippines', icon: <RoomService sx={{ fontSize: 14, mr: 1 }} /> },
    { id: '4', name: 'Dolores Tropicana Resort', slug: 'dolores-tropicana-resort', city: 'General Santos City', country: 'Philippines', icon: <RoomService sx={{ fontSize: 14, mr: 1 }} /> },
    { id: '5', name: 'Marina Bay Resort', slug: 'marina-bay-resort', city: 'Davao City', country: 'Philippines', icon: <RoomService sx={{ fontSize: 14, mr: 1 }} /> },
    { id: '6', name: 'Paradise Beach Hotel', slug: 'paradise-beach-hotel', city: 'Cebu City', country: 'Philippines', icon: <RoomService sx={{ fontSize: 14, mr: 1 }} /> },
  ];

  const mockFeatures = [
    { name: 'Loyalty Program', href: '/loyalty', icon: <Handshake sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Gift Cards', href: '/gift-cards', icon: <CardGiftcard sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Sustainability', href: '/sustainability', icon: <Spa sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Careers', href: '/careers', icon: <Work sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Press & Media', href: '/press', icon: <Newspaper sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Sitemap', href: '/sitemap', icon: <Map sx={{ fontSize: 14, mr: 1 }} /> },
    { name: 'Accessibility', href: '/accessibility', icon: <Accessible sx={{ fontSize: 14, mr: 1 }} /> },
  ];

  const getSocialIcon = (platform: string) => {
    const iconProps = { sx: { fontSize: 18 } };
    switch (platform) {
      case 'facebook': return <Facebook {...iconProps} />;
      case 'instagram': return <Instagram {...iconProps} />;
      case 'twitter': return <Twitter {...iconProps} />;
      case 'youtube': return <YouTube {...iconProps} />;
      case 'linkedin': return <LinkedIn {...iconProps} />;
      default: return null;
    }
  };

  const socialLinks = [
    { platform: 'facebook', url: websiteConfig?.facebookUrl || 'https://facebook.com/tropicanahotels' },
    { platform: 'instagram', url: websiteConfig?.instagramUrl || 'https://instagram.com/tropicanahotels' },
    { platform: 'twitter', url: websiteConfig?.twitterUrl || 'https://twitter.com/tropicanahotels' },
    { platform: 'youtube', url: websiteConfig?.youtubeUrl || 'https://youtube.com/tropicanahotels' },
    { platform: 'linkedin', url: websiteConfig?.linkedinUrl || 'https://linkedin.com/company/tropicanahotels' },
  ].filter(link => link.url);

  const linkStyle = {
    color: theme.textSecondary,
    textDecoration: 'none',
    fontSize: '0.78rem',
    py: 0.2,
    transition: 'all 0.2s ease',
    '&:hover': {
      color: theme.text,
      paddingLeft: '4px',
    },
  };

  const headingStyle = {
    color: theme.text,
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    mb: 2,
  };

  const contactTextStyle = {
    color: theme.textSecondary,
    fontSize: '0.78rem',
    lineHeight: 1.4,
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.background,
        color: theme.text,
        borderTop: `1px solid ${theme.border}`,
        
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ py: { xs: 5, md: 7 } }}>
          {/* Main Footer Grid - 5 Column Layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: { xs: 4, lg: 4, xl: 8 },
              mb: 5,
            }}
          >
            {/* Column 1: Brand & Contact */}
            <Box sx={{ flex: { lg: '0 0 240px', xl: '0 0 300px' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.2rem', md: '1.3rem' },
                  color: theme.text,
                  mb: 1.5,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  lineHeight: 1.2,
                }}
              >
                {siteName}
              </Typography>

              {websiteConfig?.tagline && (
                <Typography
                  sx={{
                    color: theme.textMuted,
                    fontSize: '0.75rem',
                    mb: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 500,
                  }}
                >
                  {websiteConfig.tagline}
                </Typography>
              )}

              {/* Contact Info - Compact */}
              <Box sx={{ mb: 3 }}>
                {(websiteConfig?.headquarters || 'General Santos City, Philippines') && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <LocationOn sx={{ color: theme.textMuted, mr: 1, fontSize: 16, mt: 0.1 }} />
                    <Typography sx={contactTextStyle}>
                      {websiteConfig?.headquarters || 'General Santos City, Philippines'}
                    </Typography>
                  </Box>
                )}

                {(websiteConfig?.primaryPhone || '+63 83 552 8886') && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ color: theme.textMuted, mr: 1, fontSize: 16 }} />
                    <Typography
                      component="a"
                      href={`tel:${websiteConfig?.primaryPhone || '+63835528886'}`}
                      sx={{ ...contactTextStyle, '&:hover': { color: theme.text } }}
                    >
                      {websiteConfig?.primaryPhone || '+63 83 552 8886'}
                    </Typography>
                  </Box>
                )}

                {(websiteConfig?.primaryEmail || 'info@tropicanahotels.com') && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ color: theme.textMuted, mr: 1, fontSize: 16 }} />
                    <Typography
                      component="a"
                      href={`mailto:${websiteConfig?.primaryEmail || 'info@tropicanahotels.com'}`}
                      sx={{ ...contactTextStyle, '&:hover': { color: theme.text } }}
                    >
                      {websiteConfig?.primaryEmail || 'info@tropicanahotels.com'}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Social Media - Minimal */}
              {socialLinks.length > 0 && (
                <Box sx={{ mb: { xs: 3, lg: 0 } }}>
                  <Typography sx={headingStyle}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {socialLinks.map(({ platform, url }) => (
                      <IconButton
                        key={platform}
                        component="a"
                        href={url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="medium"
                        sx={{
                          color: theme.textMuted,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '4px',
                          p: 0.8,
                          minWidth: 36,
                          minHeight: 36,
                          '&:hover': {
                            color: theme.text,
                            backgroundColor: theme.surface,
                            borderColor: theme.accent,
                          },
                        }}
                      >
                        {getSocialIcon(platform)}
                      </IconButton>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Column 2: Quick Links */}
            <Box sx={{ flex: { xs: '1 1 45%', sm: '0 0 160px', lg: '0 0 180px' } }}>
              <Typography sx={headingStyle}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                {populatedQuickLinks.slice(0, 8).map((link) => (
                  <Typography
                    key={link.name}
                    component="a"
                    href={link.href}
                    sx={{ ...linkStyle, display: 'flex', alignItems: 'center' }}
                  >
                    {link.icon}
                    {link.name}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Column 3: Our Properties */}
            {businessUnits.length > 0 && (
              <Box sx={{ flex: { xs: '1 1 45%', sm: '0 0 200px', lg: '0 0 220px' } }}>
                <Typography sx={headingStyle}>
                  Our Properties
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                  {populatedBusinessUnits.map((property) => (
                    <Typography
                      key={property.id}
                      component="a"
                      href={`/properties/${property.slug}`}
                      sx={{ ...linkStyle, display: 'flex', alignItems: 'center' }}
                    >
                      {property.icon}
                      {property.name}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Column 4: Features */}
            <Box sx={{ flex: { xs: '1 1 45%', sm: '0 0 160px', lg: '0 0 180px' } }}>
              <Typography sx={headingStyle}>
                Features
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                {mockFeatures.map((link) => (
                  <Typography
                    key={link.name}
                    component="a"
                    href={link.href}
                    sx={{ ...linkStyle, display: 'flex', alignItems: 'center' }}
                  >
                    {link.icon}
                    {link.name}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Column 5: Newsletter Subscribe */}
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 auto' }, minWidth: '250px' }}>
              <Typography sx={headingStyle}>
                Subscribe to our Newsletter
              </Typography>
              <Typography sx={{ color: theme.textSecondary, fontSize: '0.8rem', mb: 2 }}>
                Get the latest news and special offers directly to your inbox.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Enter your email"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      color: theme.textSecondary,
                      '& fieldset': { borderColor: theme.border },
                      '&:hover fieldset': { borderColor: theme.accent },
                      '&.Mui-focused fieldset': { borderColor: theme.primary },
                      borderRadius: '4px',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: theme.textMuted,
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: theme.primary,
                    color: theme.background,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    letterSpacing: '0.5px',
                    py: 1.2,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: theme.textSecondary,
                    },
                  }}
                >
                  <Send sx={{ fontSize: 16 }} />
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Bottom Section */}
          <Divider sx={{ borderColor: theme.border, mb: 3 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
            }}
          >
            <Typography
              sx={{
                color: theme.textMuted,
                fontSize: '0.75rem',
                order: { xs: 2, md: 1 },
              }}
            >
              © {currentYear} {companyName}. All rights reserved.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2.5,
                flexWrap: 'wrap',
                order: { xs: 1, md: 2 },
              }}
            >
              {[
                { name: 'Privacy Policy', url: websiteConfig?.privacyPolicyUrl || '/privacy' },
                { name: 'Terms of Service', url: websiteConfig?.termsOfServiceUrl || '/terms' },
                { name: 'Cookie Policy', url: websiteConfig?.cookiePolicyUrl || '/cookies' },
                { name: 'Careers', url: '/careers' },
              ].map((link) => (
                <Typography
                  key={link.name}
                  component="a"
                  href={link.url}
                  sx={{
                    color: theme.textMuted,
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: theme.textSecondary },
                  }}
                >
                  {link.name}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;