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
} from '@mui/material';
import {
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// FIX: Corrected the interface definition to match the server action's output
export interface RestaurantWithDetails {
  id: string;
  businessUnitId: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  type: string;
  cuisine: string[];
  location: string | null;
  phone: string | null;
  email: string | null;
  totalSeats: number | null;
  privateRooms: number;
  outdoorSeating: boolean;
  airConditioned: boolean;
  operatingHours: Record<string, unknown> | null;
  features: string[];
  dressCode: string | null;
  priceRange: string | null;
  averageMeal: string | null;
  currency: string;
  acceptsReservations: boolean;
  advanceBookingDays: number;
  minPartySize: number;
  maxPartySize: number | null;
  virtualTourUrl: string | null;
  hasMenu: boolean;
  menuUrl: string | null;
  menuUpdated: Date | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  businessUnit: {
    id: string;
    name: string;
    displayName: string;
  };
  _count: {
    menuCategories: number;
    reservations: number;
  };
  images: {
    id: string;
    isPrimary: boolean;
    image: {
      originalUrl: string;
      thumbnailUrl: string | null;
      mediumUrl: string | null;
      largeUrl: string | null;
      title: string | null;
      description: string | null;
      altText: string | null;
    };
  }[];
}

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
};

interface RestaurantCardProps {
  restaurants: RestaurantWithDetails[];
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

// Helper function to get the best image URL
const getImageUrl = (images: RestaurantWithDetails['images']): string => {
  if (!images || images.length === 0) {
    return 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800';
  }

  const primaryImage = images.find(img => img.isPrimary) || images[0];
  
  return primaryImage?.image?.mediumUrl || 
         primaryImage?.image?.originalUrl || 
         primaryImage?.image?.thumbnailUrl ||
         'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800';
};

// Helper function to get image alt text
const getImageAlt = (images: RestaurantWithDetails['images'], restaurantName: string): string => {
  if (!images || images.length === 0) {
    return `${restaurantName} interior`;
  }

  const primaryImage = images.find(img => img.isPrimary) || images[0];
  return primaryImage.image.altText || 
         primaryImage.image.title || 
         `${restaurantName} interior`;
};

// Helper function to format price range
const formatPriceRange = (priceRange: string | null): string => {
  if (!priceRange) return 'Moderate';
  return priceRange;
};

const Restaurants: React.FC<RestaurantCardProps> = ({ restaurants }) => {
  // State to track current image index for each restaurant
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
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

  // Initialize image indices
  useEffect(() => {
    const initialIndices: { [key: string]: number } = {};
    restaurants.forEach((restaurant) => {
      initialIndices[restaurant.id] = 0;
    });
    setCurrentImageIndex(initialIndices);
  }, [restaurants]);

  // Don't render if no restaurants
  if (!restaurants || restaurants.length === 0) {
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
            No restaurants available at this time.
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
            Our Restaurants
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
            Experience culinary excellence across all our properties. Each restaurant
            offers unique flavors inspired by its surroundings, crafted by world-class chefs.
          </Typography>
        </Box>
      </Container>

      {/* Restaurants List */}
      <Box sx={{ width: '100%' }}>
        {restaurants.map((restaurant, index) => {
          const isEven = index % 2 === 0;
          const imageUrl = getImageUrl(restaurant.images);
          const imageAlt = getImageAlt(restaurant.images, restaurant.name);
          
          return (
            <motion.div
              key={restaurant.id}
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
                    '& .restaurant-image': {
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
                      image={imageUrl}
                      alt={imageAlt}
                      className="restaurant-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />

                    {/* Restaurant Type Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        [isEven ? 'right' : 'left']: 24,
                        backgroundColor: pitchBlackTheme.surface,
                        border: `1px solid ${pitchBlackTheme.border}`,
                        px: 3,
                        py: 1.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: pitchBlackTheme.primaryHover,
                          borderColor: pitchBlackTheme.primaryHover,
                          '& .type-text': {
                            color: pitchBlackTheme.primary,
                          },
                        },
                      }}
                    >
                      <Typography 
                        className="type-text"
                        sx={{ 
                          fontWeight: 700,
                          color: pitchBlackTheme.text,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          transition: 'color 0.3s ease',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        }}
                      >
                        {restaurant.type.replace('_', ' ')}
                      </Typography>
                    </Box>

                    {/* Price Badge */}
                    {(restaurant.priceRange || restaurant.averageMeal) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 24,
                          [isEven ? 'right' : 'left']: 24,
                          backgroundColor: pitchBlackTheme.surface,
                          border: `1px solid ${pitchBlackTheme.border}`,
                          px: 3,
                          py: 1.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: pitchBlackTheme.primaryHover,
                            borderColor: pitchBlackTheme.primaryHover,
                            '& .price-text': {
                              color: pitchBlackTheme.primary,
                            },
                          },
                        }}
                      >
                        <Typography
                          className="price-text"
                          sx={{
                            color: pitchBlackTheme.text,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'color 0.3s ease',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          {formatPriceRange(restaurant.priceRange)}
                        </Typography>
                      </Box>
                    )}
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
                      {/* Restaurant Number */}
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
                        Restaurant {String(index + 1).padStart(2, '0')}
                      </Typography>
                      
                      {/* Restaurant Name */}
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
                        {restaurant.name}
                      </Typography>
                      
                      {/* Location */}
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
                        <LocationOn sx={{ 
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
                          {restaurant.location || restaurant.businessUnit.displayName}
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
                        {restaurant.shortDesc || (restaurant.description ? restaurant.description.substring(0, 200) + '...' : 'Experience exceptional cuisine in this premium dining establishment.')}
                      </Typography>
                      
                      {/* View Menu Button */}
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
                          href={`/restaurants/${restaurant.slug}`}
                          component="a"
                        >
                          View Menu
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
            Ready to experience
            <br />
            culinary excellence?
          </Typography>
          
          <Button
            endIcon={<ArrowForward />}
            component="a"
            href="/restaurants"
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
            View All Restaurants
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Restaurants;