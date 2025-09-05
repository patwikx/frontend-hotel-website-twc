"use client";

import React from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { LocationOn, ArrowForward, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getPublishedRestaurants } from '@/lib/actions/restaurants';

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

// Define a type for the restaurants data passed as a prop
interface RestaurantsContentProps {
  restaurants: Awaited<ReturnType<typeof getPublishedRestaurants>>;
}

const RestaurantsContent: React.FC<RestaurantsContentProps> = ({ restaurants }) => {
  const getImageUrl = (images: typeof restaurants[0]['images']): string => {
    if (!images || images.length === 0) {
      return 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800';
    }

    const primaryImage = images.find(img => img.isPrimary) || images[0];
    
    return primaryImage?.image?.mediumUrl || 
           primaryImage?.image?.originalUrl || 
           primaryImage?.image?.thumbnailUrl ||
           'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  const getImageAlt = (images: typeof restaurants[0]['images'], restaurantName: string): string => {
    if (!images || images.length === 0) {
      return `${restaurantName} interior`;
    }

    const primaryImage = images.find(img => img.isPrimary) || images[0];
    return primaryImage.image.altText || 
           primaryImage.image.title || 
           `${restaurantName} interior`;
  };

  const formatPriceRange = (priceRange: string | null): string => {
    if (!priceRange) return 'Moderate';
    return priceRange;
  };

  const getRestaurantTypeDisplay = (type: string): string => {
    const typeMap: Record<string, string> = {
      'FINE_DINING': 'Fine Dining',
      'CASUAL_DINING': 'Casual Dining',
      'FAST_CASUAL': 'Fast Casual',
      'CAFE': 'Café',
      'BAR': 'Bar & Lounge',
      'BUFFET': 'Buffet',
      'ROOM_SERVICE': 'Room Service',
      'SPECIALTY': 'Specialty'
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
            All Restaurants
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
            Explore our complete collection of dining experiences. From fine dining to casual cafés,
            discover culinary excellence across all our properties.
          </Typography>
        </Box>
      </Container>

      {/* Restaurants Grid */}
      <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 16 } }}>
        {restaurants.length === 0 ? (
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
              No restaurants available at this time
            </Typography>
            <Typography sx={{ color: pitchBlackTheme.textSecondary, mt: 2 }}>
              Check back soon for our dining options and culinary experiences.
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
            {restaurants.map((restaurant, index) => {
              const imageUrl = getImageUrl(restaurant.images);
              const imageAlt = getImageAlt(restaurant.images, restaurant.name);
              
              return (
                <motion.div
                  key={restaurant.id}
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
                        '& .restaurant-image': {
                          transform: 'scale(1.05)',
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={imageUrl}
                        alt={imageAlt}
                        className="restaurant-image"
                        sx={{
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                      
                      {/* Restaurant Type Badge */}
                      <Chip
                        label={getRestaurantTypeDisplay(restaurant.type)}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: pitchBlackTheme.surface,
                          color: pitchBlackTheme.text,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          border: `1px solid ${pitchBlackTheme.border}`,
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        }}
                      />

                      {/* Price Range Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          backgroundColor: pitchBlackTheme.surface,
                          border: `1px solid ${pitchBlackTheme.border}`,
                          px: 2,
                          py: 1,
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          color: pitchBlackTheme.text,
                        }}
                      >
                        {formatPriceRange(restaurant.priceRange)}
                      </Box>
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
                        }}
                      >
                        {restaurant.name}
                      </Typography>

                      {/* Location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOn sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                        <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                          {restaurant.location || restaurant.businessUnit.displayName}
                        </Typography>
                      </Box>

                      {/* Cuisine */}
                      {restaurant.cuisine.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                            {restaurant.cuisine.join(', ')}
                          </Typography>
                        </Box>
                      )}

                      {/* Contact Info */}
                      {restaurant.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Phone sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                          <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                            {restaurant.phone}
                          </Typography>
                        </Box>
                      )}

                      {/* Corrected: Removed flex: 1 from this Typography component to prevent it from pushing the button out of view */}
                      <Typography
                        sx={{
                          color: pitchBlackTheme.textSecondary,
                          mb: 3,
                          lineHeight: 1.6,
                          fontSize: '0.95rem',
                          // Removed flex: 1 here
                        }}
                      >
                        {restaurant.shortDesc || (restaurant.description ? restaurant.description.substring(0, 150) + '...' : 'Experience exceptional cuisine in this premium dining establishment.')}
                      </Typography>

                      <Button
                        fullWidth
                        endIcon={<ArrowForward />}
                        href={`/restaurants/${restaurant.slug}`}
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
                        View Menu
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>
        )}
      </Container>
    </>
  );
};

export default RestaurantsContent;