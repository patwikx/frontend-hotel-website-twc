"use client";

import React from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Button, Chip, Stack } from '@mui/material';
import { CalendarToday, ArrowForward, LocalOffer } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Pitch black theme with white hover effects
const pitchBlackTheme = {
  background: '#000000',
  surface: '#000000',
  surfaceHover: '#111111',
  primary: '#000000',
  primaryHover: '#ffffff',
  text: '#ffffff',
  textSecondary: '#6b7280',
  border: '#1a1a1a',
  selected: '#ffffff',
  selectedBg: 'rgba(255, 255, 255, 0.08)',
  shadow: 'rgba(255, 255, 255, 0.1)',
  shadowMedium: 'rgba(255, 255, 255, 0.15)',
  error: '#ef4444',
  errorHover: '#b91c1c',
};

// Framer Motion variants
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
};

// Updated type definitions to handle potential null and Date values
interface ImageData {
  originalUrl: string;
  altText?: string | null;
  title?: string | null;
}

interface OfferImage {
  isPrimary: boolean;
  image: ImageData;
}

interface BusinessUnit {
  displayName: string;
}

interface SpecialOffer {
  id: string;
  title: string;
  slug: string;
  // Change 'string' to 'Date' to match the fetched data
  validTo: Date; 
  type: string;
  shortDesc: string | null;
  description: string;
  currency: string;
  originalPrice: number | null;
  offerPrice: number;
  savingsPercent: number | null;
  savingsAmount: number | null;
  images: OfferImage[];
  businessUnit: BusinessUnit | null;
}

interface OffersContentProps {
  offers: SpecialOffer[];
}

const OffersContent: React.FC<OffersContentProps> = ({ offers }) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date); // Now passing the Date object directly
  };

  const calculateDiscount = (offer: SpecialOffer): string => {
    if (offer.savingsPercent) {
      return `${offer.savingsPercent}% OFF`;
    }
    if (offer.savingsAmount && offer.originalPrice) {
      const percentage = Math.round((offer.savingsAmount / offer.originalPrice) * 100);
      return `${percentage}% OFF`;
    }
    return 'SPECIAL OFFER';
  };

  const getPrimaryImage = (offer: SpecialOffer): string => {
    const primaryImage = offer.images.find(img => img.isPrimary);
    if (primaryImage) {
      return primaryImage.image.originalUrl;
    }
    
    if (offer.images.length > 0) {
      return offer.images[0].image.originalUrl;
    }
    
    return 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  const getImageAlt = (offer: SpecialOffer): string => {
    const primaryImage = offer.images.find(img => img.isPrimary);
    if (primaryImage?.image.altText) {
      return primaryImage.image.altText;
    }
    if (primaryImage?.image.title) {
      return primaryImage.image.title;
    }
    return offer.title;
  };

  const getOfferTypeDisplay = (type: string): string => {
    const typeMap: Record<string, string> = {
      'EARLY_BIRD': 'Early Bird',
      'LAST_MINUTE': 'Last Minute',
      'SEASONAL': 'Seasonal',
      'PACKAGE': 'Package Deal',
      'LOYALTY': 'Loyalty Reward',
      'GROUP': 'Group Discount',
      'EXTENDED_STAY': 'Extended Stay',
      'WEEKEND': 'Weekend Special',
      'WEEKDAY': 'Weekday Deal',
      'HONEYMOON': 'Honeymoon Package',
      'FAMILY': 'Family Package',
      'BUSINESS': 'Business Deal',
      'ANNIVERSARY': 'Anniversary Special',
      'HOLIDAY': 'Holiday Special'
    };
    return typeMap[type] || type.replace('_', ' ');
  };

  return (
    <>
      {/* Header Section */}
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 16 }, pb: { xs: 6, md: 12 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 2,
            }}
          >
            Premium Hospitality
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              color: pitchBlackTheme.text,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: { xs: 1.1, md: 1.1 },
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              mb: 4,
            }}
          >
            Special Offers
          </Typography>
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Discover exclusive deals and packages for unforgettable luxury experiences
            at unbeatable prices across all our properties.
          </Typography>
        </Box>
      </Container>

      {/* Offers Grid */}
      <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 16 } }}>
        {offers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                color: pitchBlackTheme.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              No special offers available at this time
            </Typography>
            <Typography sx={{ color: pitchBlackTheme.textSecondary, mt: 2 }}>
              Check back soon for exclusive deals and packages.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 6,
            }}
          >
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Card
                  sx={{
                    backgroundColor: pitchBlackTheme.surface,
                    border: `1px solid ${pitchBlackTheme.border}`,
                    borderRadius: 0,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${pitchBlackTheme.selectedBg}`,
                      borderColor: pitchBlackTheme.text,
                      '& .offer-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={getPrimaryImage(offer)}
                      alt={getImageAlt(offer)}
                      className="offer-image"
                      sx={{
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    
                    {/* Discount Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: pitchBlackTheme.error,
                        color: 'white',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 900,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: pitchBlackTheme.errorHover,
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      {calculateDiscount(offer)}
                    </Box>

                    {/* Offer Type Badge */}
                    <Chip
                      label={getOfferTypeDisplay(offer.type)}
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        backgroundColor: pitchBlackTheme.surface,
                        color: pitchBlackTheme.text,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        border: `1px solid ${pitchBlackTheme.border}`,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: pitchBlackTheme.text,
                        mb: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        lineHeight: 1.2,
                      }}
                    >
                      {offer.title}
                    </Typography>

                    {/* Valid Until */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                        Valid until {formatDate(offer.validTo)}
                      </Typography>
                    </Box>

                    {/* Property */}
                    {offer.businessUnit && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalOffer sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                        <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                          {offer.businessUnit.displayName}
                        </Typography>
                      </Box>
                    )}

                    {/* Price Information */}
                    {offer.originalPrice && (
                      <Box sx={{ mb: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography
                            sx={{
                              fontSize: '1.5rem',
                              fontWeight: 900,
                              color: pitchBlackTheme.error,
                              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            }}
                          >
                            {offer.currency} {offer.offerPrice.toLocaleString()}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: pitchBlackTheme.textSecondary,
                              textDecoration: 'line-through',
                            }}
                          >
                            {offer.currency} {offer.originalPrice.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Box>
                    )}

                    <Typography
                      sx={{
                        color: pitchBlackTheme.textSecondary,
                        mb: 3,
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                        flex: 1,
                      }}
                    >
                      {offer.shortDesc || offer.description.substring(0, 150) + '...'}
                    </Typography>

                    <Button
                      fullWidth
                      endIcon={<ArrowForward />}
                      href={`/offers/${offer.slug}`}
                      sx={{
                        backgroundColor: pitchBlackTheme.primary,
                        color: pitchBlackTheme.text,
                        border: `2px solid ${pitchBlackTheme.text}`,
                        py: 1.5,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        borderRadius: 0,
                        fontFamily: '"Arial Black", "Helvetica", sans-serif',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: pitchBlackTheme.primaryHover,
                          borderColor: pitchBlackTheme.primaryHover,
                          color: pitchBlackTheme.primary,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default OffersContent;