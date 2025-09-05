'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import { CalendarToday, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { SpecialOfferData } from '../lib/actions/special-offers';

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
  errorBg: 'rgba(239, 68, 68, 0.1)',
  errorHover: '#b91c1c',
};

interface SpecialOffersProps {
  offers: SpecialOfferData[];
}

// Create motion variants for the animations - mobile-friendly
const cardVariants = {
  hiddenLeft: {
    opacity: 0,
    x: -100,
    scale: 0.95
  },
  hiddenRight: {
    opacity: 0,
    x: 100,
    scale: 0.95
  },
  hiddenMobile: {
    opacity: 0,
    y: 50, // Slide up from bottom on mobile
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  }
};

const SpecialOffers: React.FC<SpecialOffersProps> = ({ offers }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const calculateDiscount = (offer: SpecialOfferData): string => {
    if (offer.savingsPercent) {
      return `${offer.savingsPercent}% OFF`;
    }
    if (offer.savingsAmount && offer.originalPrice) {
      const percentage = Math.round((Number(offer.savingsAmount) / Number(offer.originalPrice)) * 100);
      return `${percentage}% OFF`;
    }
    return 'SPECIAL OFFER';
  };

  const getPrimaryImage = (offer: SpecialOfferData): string => {
    const primaryImage = offer.images.find(img => img.isPrimary);
    if (primaryImage) {
      return primaryImage.image.originalUrl;
    }
    
    if (offer.images.length > 0) {
      return offer.images[0].image.originalUrl;
    }
    
    return '/images/placeholder-offer.jpg';
  };

  const getImageAlt = (offer: SpecialOfferData): string => {
    const primaryImage = offer.images.find(img => img.isPrimary);
    if (primaryImage?.image.altText) {
      return primaryImage.image.altText;
    }
    if (primaryImage?.image.title) {
      return primaryImage.image.title;
    }
    return offer.title;
  };

  const generateTerms = (offer: SpecialOfferData): string[] => {
    const terms: string[] = [];
    
    terms.push(`Valid until ${formatDate(offer.validTo)}`);
    
    if (offer.businessUnit) {
      terms.push(`Available at ${offer.businessUnit.displayName}`);
    }
    
    if (offer.originalPrice && offer.offerPrice) {
      terms.push(`Original price ${offer.currency} ${Number(offer.originalPrice).toLocaleString()}`);
    }
    
    terms.push('Subject to availability');
    terms.push('Terms and conditions apply');
    
    return terms;
  };

  if (!offers || offers.length === 0) {
    return (
      <Box sx={{ 
        py: { xs: 8, md: 16 }, 
        textAlign: 'center', 
        backgroundColor: pitchBlackTheme.background, 
        color: pitchBlackTheme.text,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Container maxWidth="xl">
          <Typography 
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: pitchBlackTheme.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            No special offers available at the moment.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        backgroundColor: pitchBlackTheme.background,
        position: 'relative',
        color: pitchBlackTheme.text,
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden', // Prevent horizontal scroll on mobile
      }}
    >
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
              whiteSpace: 'nowrap',
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
            Take advantage of our exclusive deals and packages for an unforgettable luxury experience
            at unbeatable prices.
          </Typography>
        </Box>
      </Container>

      {/* Offers List */}
      <Box sx={{ width: '100%' }}>
        {offers.map((offer, index) => {
          const isEven = index % 2 === 0;
          const terms = generateTerms(offer);
          
          return (
            <motion.div
              key={offer.id}
              initial={isMobile ? "hiddenMobile" : (isEven ? "hiddenLeft" : "hiddenRight")} // Slide up on mobile, left/right on desktop
              whileInView="visible"
              viewport={{ once: true, margin: "-50px", amount: 0.2 }}
              variants={cardVariants}
              transition={{
                duration: isMobile ? 0.5 : 0.7, // Slightly faster on mobile
                ease: isMobile ? [0.4, 0, 0.2, 1] : [0.25, 0.1, 0.25, 1], // Different easing for mobile
                type: "tween"
              }}
              style={{ 
                width: '100%',
              }}
            >
              <Card
                sx={{
                  backgroundColor: pitchBlackTheme.surface,
                  borderRadius: 0,
                  boxShadow: 'none',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  width: '100%',
                  mb: 0,
                  // Ensure card is visible and animated properly
                  opacity: 1,
                  '&:hover': {
                    '& .offer-image': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { 
                      xs: 'column', 
                      md: isEven ? 'row' : 'row-reverse' 
                    },
                    minHeight: { xs: 'auto', md: '600px' },
                    width: '100%',
                  }}
                >
                  {/* Image Section */}
                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 50%' },
                      position: 'relative',
                      overflow: 'hidden',
                      height: { xs: '400px', md: 'auto' },
                      minHeight: { xs: '400px', md: '100%' },
                      width: '100%',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getPrimaryImage(offer)}
                      alt={getImageAlt(offer)}
                      className="offer-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    
                    {/* Discount Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        [isEven ? 'right' : 'left']: 24,
                        backgroundColor: pitchBlackTheme.error,
                        color: 'white',
                        px: 4,
                        py: 2,
                        fontSize: '1.125rem',
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
                  </Box>

                  {/* Content Section */}
                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 50%' },
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: { xs: 4, md: 6, lg: 8 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: { xs: 'center', md: isEven ? 'left' : 'right' },
                        width: '100%',
                      }}
                    >
                      {/* Offer Number */}
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: pitchBlackTheme.textSecondary,
                          letterSpacing: '2px',
                          mb: 2,
                          display: 'block',
                          textTransform: 'uppercase',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        }}
                      >
                        Offer {String(index + 1).padStart(2, '0')}
                      </Typography>

                      {/* Offer Title */}
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                          color: pitchBlackTheme.text,
                          mb: 3,
                          letterSpacing: '0.02em',
                          lineHeight: 1.1,
                          textTransform: 'uppercase',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                        }}
                      >
                        {offer.title}
                      </Typography>

                      {/* Valid Until */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 4,
                        justifyContent: { 
                          xs: 'center', 
                          md: isEven ? 'flex-start' : 'flex-end' 
                        },
                        flexWrap: 'wrap',
                        gap: 1,
                      }}>
                        <CalendarToday sx={{ 
                          color: pitchBlackTheme.textSecondary,
                          fontSize: 20,
                        }} />
                        <Typography 
                          sx={{ 
                            color: pitchBlackTheme.textSecondary,
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          Valid until {formatDate(offer.validTo)}
                        </Typography>
                      </Box>

                      {/* Description */}
                      <Typography
                        sx={{
                          color: pitchBlackTheme.textSecondary,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          lineHeight: 1.6,
                          mb: 5,
                          fontWeight: 400,
                          maxWidth: { xs: '100%', md: '500px' },
                          mx: { xs: 'auto', md: isEven ? '0' : 'auto' },
                          ml: { md: isEven ? '0' : 'auto' },
                        }}
                      >
                        {offer.shortDesc || offer.description}
                      </Typography>

                      {/* Price Information */}
                      {offer.originalPrice && (
                        <Box sx={{ mb: 4 }}>
                          <Stack 
                            direction="row" 
                            alignItems="center" 
                            spacing={2}
                            sx={{
                              justifyContent: { 
                                xs: 'center', 
                                md: isEven ? 'flex-start' : 'flex-end' 
                              },
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: pitchBlackTheme.error,
                                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                              }}
                            >
                              {offer.currency} {Number(offer.offerPrice).toLocaleString()}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                color: pitchBlackTheme.textSecondary,
                                textDecoration: 'line-through',
                              }}
                            >
                              {offer.currency} {Number(offer.originalPrice).toLocaleString()}
                            </Typography>
                          </Stack>
                        </Box>
                      )}

                      {/* Terms & Conditions */}
                      <Box sx={{ mb: 5 }}>
                        <Typography 
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: pitchBlackTheme.text,
                            mb: 2,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          Terms & Conditions
                        </Typography>
                        <Stack 
                          spacing={1}
                          sx={{ 
                            alignItems: { 
                              xs: 'center', 
                              md: isEven ? 'flex-start' : 'flex-end' 
                            },
                          }}
                        >
                          {terms.slice(0, 2).map((term, termIndex) => (
                            <Typography
                              key={termIndex}
                              sx={{
                                fontSize: '0.95rem',
                                color: pitchBlackTheme.textSecondary,
                                fontWeight: 500,
                                position: 'relative',
                                maxWidth: '400px',
                                textAlign: { xs: 'center', md: isEven ? 'left' : 'right' },
                                '&::before': {
                                  content: '"•"',
                                  color: pitchBlackTheme.text,
                                  fontWeight: 700,
                                  mr: 1,
                                }
                              }}
                            >
                              {term}
                            </Typography>
                          ))}
                          {terms.length > 2 && (
                            <Typography
                              sx={{
                                fontSize: '0.95rem',
                                color: pitchBlackTheme.textSecondary,
                                fontWeight: 500,
                                position: 'relative',
                                '&::before': {
                                  content: '"•"',
                                  color: pitchBlackTheme.text,
                                  fontWeight: 700,
                                  mr: 1,
                                }
                              }}
                            >
                              +{terms.length - 2} more conditions apply
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      {/* Book Now Button */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: { 
                            xs: 'center', 
                            md: isEven ? 'flex-start' : 'flex-end' 
                          },
                        }}
                      >
                        <Button
                          endIcon={<ArrowForward sx={{ fontSize: 16, transition: 'color 0.3s ease' }} />}
                          sx={{
                            backgroundColor: pitchBlackTheme.primary,
                            color: pitchBlackTheme.text,
                            border: `2px solid ${pitchBlackTheme.text}`,
                            px: 5,
                            py: 2.5,
                            fontSize: '0.8rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            borderRadius: 0,
                            minWidth: '160px',
                            fontFamily: '"Arial Black", "Helvetica", sans-serif',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              backgroundColor: pitchBlackTheme.primaryHover,
                              borderColor: pitchBlackTheme.primaryHover,
                              color: pitchBlackTheme.primary,
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${pitchBlackTheme.selectedBg}`,
                              '& .MuiSvgIcon-root': {
                                color: pitchBlackTheme.primary,
                              },
                            },
                          }}
                          href={`/offers/${offer.slug}`}
                          component="a"
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </Box>

      {/* Bottom CTA Section */}
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: { xs: 8, md: 12 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem' },
              color: pitchBlackTheme.text,
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: 0.9,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Limited time offers
            <br />
            won&apos;t last long
          </Typography>
          
          <Button
            endIcon={<ArrowForward />}
            component="a"
            href="/special-offers"
            sx={{
              backgroundColor: pitchBlackTheme.primary,
              color: pitchBlackTheme.text,
              border: `2px solid ${pitchBlackTheme.text}`,
              px: 10,
              py: 3.5,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: 0,
              mt: 4,
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: pitchBlackTheme.primaryHover,
                borderColor: pitchBlackTheme.primaryHover,
                color: pitchBlackTheme.primary,
                transform: 'translateY(-3px)',
                boxShadow: `0 12px 24px ${pitchBlackTheme.selectedBg}`,
                '& .MuiSvgIcon-root': {
                  color: pitchBlackTheme.primary,
                },
              },
            }}
          >
            View All Offers
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SpecialOffers;