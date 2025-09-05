import React from 'react';
import { notFound } from 'next/navigation';
import { Box, Container, Typography, Button, Card, Stack } from '@mui/material';
import { 
  LocationOn, 
  ArrowForward, 
  ArrowBack,
  People,
  Bed,
  AspectRatio,
  Balcony,
  Pool,
  Kitchen,
  SmokingRooms,
  Pets,
  Accessible,
  Star,
} from '@mui/icons-material';
import Link from 'next/link';
import { getRoomTypeByIdAndProperty } from '@/lib/room-details';

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

interface RoomDetailPageProps {
  params: { slug: string; id: string };
}

const RoomDetailPage: React.FC<RoomDetailPageProps> = async ({ params }) => {
  const { slug, id } = await params;
  
  const roomType = await getRoomTypeByIdAndProperty(id, slug);

  if (!roomType) {
    notFound();
  }

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
  };

  const getRoomTypeDisplay = (type: string): string => {
    return type.replace('_', ' ').toLowerCase();
  };

  const primaryImage = roomType.images.find(img => img.isPrimary)?.image.originalUrl || 
                       roomType.images[0]?.image.originalUrl || 
                       'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1920';

  const defaultRate = roomType.rates.find(rate => rate.isDefault) || roomType.rates[0];

  return (
    <Box sx={{ 
      backgroundColor: pitchBlackTheme.background, 
      color: pitchBlackTheme.text, 
      minHeight: '100vh',
      width: '100%',
    }}>
      {/* Back Navigation */}
      <Container maxWidth="xl" sx={{ pt: 6, pb: 3 }}>
        <Button
          component={Link}
          href={`/properties/${slug}`}
          startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
          sx={{
            color: pitchBlackTheme.textSecondary,
            textTransform: 'uppercase',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '1px',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            border: `1px solid ${pitchBlackTheme.border}`,
            px: 3,
            py: 1.5,
            borderRadius: 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              color: pitchBlackTheme.primary,
              backgroundColor: pitchBlackTheme.primaryHover,
              borderColor: pitchBlackTheme.primaryHover,
              transform: 'translateY(-1px)',
            },
          }}
        >
          Back to {roomType.businessUnit.displayName}
        </Button>
      </Container>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '75vh',
          backgroundImage: `url(${primaryImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: '900px' }}>
            {/* Room Type Badge */}
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: pitchBlackTheme.surface,
                border: `1px solid ${pitchBlackTheme.border}`,
                px: 4,
                py: 2,
                mb: 4,
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
                  color: 'white',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'color 0.3s ease',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {getRoomTypeDisplay(roomType.type)}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '3rem', md: '4.5rem', lg: '6rem' },
                color: 'white',
                mb: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: 0.9,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {roomType.displayName}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 2 }}>
              <LocationOn sx={{ color: 'white', fontSize: 24 }} />
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {roomType.businessUnit.city}, {roomType.businessUnit.country}
              </Typography>
            </Box>
            
            {roomType.description && (
              <Typography
                sx={{
                  color: 'white',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.6,
                  mb: 6,
                  maxWidth: '650px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  fontWeight: 400,
                }}
              >
                {roomType.description}
              </Typography>
            )}
            
            {defaultRate && (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 8 }}>
                <Typography
                  sx={{
                    color: 'white',
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    fontWeight: 900,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.02em',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {formatCurrency(defaultRate.baseRate, defaultRate.currency)}
                </Typography>
                <Typography
                  sx={{
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  per night
                </Typography>
              </Box>
            )}
            
            <Link href={`/properties/${slug}/rooms/${id}/booking`} passHref>
              <Button
                endIcon={<ArrowForward sx={{ fontSize: 16, transition: 'color 0.3s ease' }} />}
                sx={{
                  backgroundColor: pitchBlackTheme.primary,
                  color: pitchBlackTheme.text,
                  border: `2px solid ${pitchBlackTheme.text}`,
                  px: 8,
                  py: 3.5,
                  fontSize: '0.875rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  borderRadius: 0,
                  minWidth: '200px',
                  fontFamily: '"Arial Black", "Helvetica", sans-serif',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.primaryHover,
                    borderColor: pitchBlackTheme.primaryHover,
                    color: pitchBlackTheme.primary,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${pitchBlackTheme.selectedBg}`,
                    '& .MuiSvgIcon-root': {
                      color: pitchBlackTheme.primary,
                    },
                  },
                }}
              >
                Book This Room
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 10, md: 16 } }}>
        {/* Room Details */}
        <Box sx={{ mb: { xs: 10, md: 16 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem' },
              color: pitchBlackTheme.text,
              mb: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Room Details
          </Typography>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 6,
              mb: 12,
            }}
          >
            {/* Occupancy */}
            <Card
              sx={{
                backgroundColor: pitchBlackTheme.surface,
                border: `1px solid ${pitchBlackTheme.border}`,
                borderRadius: 0,
                p: 6,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: pitchBlackTheme.surfaceHover,
                  transform: 'translateY(-3px)',
                  boxShadow: `0 8px 25px ${pitchBlackTheme.shadow}`,
                },
              }}
            >
              <People sx={{ fontSize: 48, color: pitchBlackTheme.text, mb: 3 }} />
              <Typography sx={{ 
                fontWeight: 700, 
                color: pitchBlackTheme.text, 
                mb: 2,
                fontSize: '1.125rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}>
                Maximum Occupancy
              </Typography>
              <Typography sx={{ 
                color: pitchBlackTheme.textSecondary, 
                fontSize: '1.25rem',
                fontWeight: 600,
                mb: 2,
              }}>
                {roomType.maxOccupancy} guests
              </Typography>
              <Typography sx={{ 
                color: pitchBlackTheme.textSecondary, 
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {roomType.maxAdults} adults • {roomType.maxChildren} children • {roomType.maxInfants} infants
              </Typography>
            </Card>

            {/* Bed Configuration */}
            {roomType.bedConfiguration && (
              <Card
                sx={{
                  backgroundColor: pitchBlackTheme.surface,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  borderRadius: 0,
                  p: 6,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 8px 25px ${pitchBlackTheme.shadow}`,
                  },
                }}
              >
                <Bed sx={{ fontSize: 48, color: pitchBlackTheme.text, mb: 3 }} />
                <Typography sx={{ 
                  fontWeight: 700, 
                  color: pitchBlackTheme.text, 
                  mb: 2,
                  fontSize: '1.125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}>
                  Bed Configuration
                </Typography>
                <Typography sx={{ 
                  color: pitchBlackTheme.textSecondary,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}>
                  {roomType.bedConfiguration}
                </Typography>
              </Card>
            )}

            {/* Room Size */}
            {roomType.roomSize && (
              <Card
                sx={{
                  backgroundColor: pitchBlackTheme.surface,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  borderRadius: 0,
                  p: 6,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 8px 25px ${pitchBlackTheme.shadow}`,
                  },
                }}
              >
                <AspectRatio sx={{ fontSize: 48, color: pitchBlackTheme.text, mb: 3 }} />
                <Typography sx={{ 
                  fontWeight: 700, 
                  color: pitchBlackTheme.text, 
                  mb: 2,
                  fontSize: '1.125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}>
                  Room Size
                </Typography>
                <Typography sx={{ 
                  color: pitchBlackTheme.textSecondary,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}>
                  {roomType.roomSize} sqm
                </Typography>
              </Card>
            )}
          </Box>

          {/* Features */}
          <Box sx={{ mb: 12 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: pitchBlackTheme.text,
                mb: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Room Features
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: 4,
              }}
            >
              {roomType.hasBalcony && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  p: 3,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderColor: pitchBlackTheme.text,
                  },
                }}>
                  <Balcony sx={{ color: pitchBlackTheme.text, fontSize: 28 }} />
                  <Typography sx={{ 
                    color: pitchBlackTheme.text, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Private Balcony
                  </Typography>
                </Box>
              )}
              {roomType.hasOceanView && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  p: 3,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderColor: pitchBlackTheme.text,
                  },
                }}>
                  <Star sx={{ color: pitchBlackTheme.text, fontSize: 28 }} />
                  <Typography sx={{ 
                    color: pitchBlackTheme.text, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Ocean View
                  </Typography>
                </Box>
              )}
              {roomType.hasPoolView && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  p: 3,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderColor: pitchBlackTheme.text,
                  },
                }}>
                  <Pool sx={{ color: pitchBlackTheme.text, fontSize: 28 }} />
                  <Typography sx={{ 
                    color: pitchBlackTheme.text, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Pool View
                  </Typography>
                </Box>
              )}
              {roomType.hasKitchenette && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  p: 3,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderColor: pitchBlackTheme.text,
                  },
                }}>
                  <Kitchen sx={{ color: pitchBlackTheme.text, fontSize: 28 }} />
                  <Typography sx={{ 
                    color: pitchBlackTheme.text, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Kitchenette
                  </Typography>
                </Box>
              )}
              {roomType.hasLivingArea && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  p: 3,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderColor: pitchBlackTheme.text,
                  },
                }}>
                  <Star sx={{ color: pitchBlackTheme.text, fontSize: 28 }} />
                  <Typography sx={{ 
                    color: pitchBlackTheme.text, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Living Area
                  </Typography>
                </Box>
              )}
              {roomType.smokingAllowed && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  p: 3,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderColor: pitchBlackTheme.text,
                  },
                }}>
                  <SmokingRooms sx={{ color: pitchBlackTheme.textSecondary, fontSize: 28 }} />
                  <Typography sx={{ 
                    color: pitchBlackTheme.text, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Smoking Allowed
                  </Typography>
                </Box>
              )}
              {roomType.petFriendly && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  p: 3,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderColor: pitchBlackTheme.text,
                  },
                }}>
                  <Pets sx={{ color: pitchBlackTheme.text, fontSize: 28 }} />
                  <Typography sx={{ 
                    color: pitchBlackTheme.text, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Pet Friendly
                  </Typography>
                </Box>
              )}
              {roomType.isAccessible && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  p: 3,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderColor: pitchBlackTheme.text,
                  },
                }}>
                  <Accessible sx={{ color: pitchBlackTheme.text, fontSize: 28 }} />
                  <Typography sx={{ 
                    color: pitchBlackTheme.text, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Accessible
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Amenities */}
          {roomType.amenities.length > 0 && (
            <Box sx={{ mb: 12 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: pitchBlackTheme.text,
                  mb: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Amenities
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  },
                  gap: 4,
                }}
              >
                {roomType.amenities.map((amenityRelation) => (
                  <Card
                    key={amenityRelation.id}
                    sx={{
                      backgroundColor: pitchBlackTheme.surface,
                      border: `1px solid ${pitchBlackTheme.border}`,
                      borderRadius: 0,
                      p: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: pitchBlackTheme.surfaceHover,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 20px ${pitchBlackTheme.shadow}`,
                      },
                    }}
                  >
                    <Typography sx={{ 
                      fontWeight: 700, 
                      color: pitchBlackTheme.text, 
                      mb: 2,
                      fontSize: '1.125rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}>
                      {amenityRelation.amenity.name}
                    </Typography>
                    {amenityRelation.amenity.description && (
                      <Typography sx={{ 
                        color: pitchBlackTheme.textSecondary, 
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}>
                        {amenityRelation.amenity.description}
                      </Typography>
                    )}
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Room Gallery */}
          {roomType.images.length > 1 && (
            <Box sx={{ mb: 12 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: pitchBlackTheme.text,
                  mb: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Room Gallery
              </Typography>
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
                {roomType.images.map((imageRelation) => (
                  <Box
                    key={imageRelation.id}
                    sx={{
                      position: 'relative',
                      height: 300,
                      borderRadius: 0,
                      overflow: 'hidden',
                      backgroundImage: `url(${imageRelation.image.originalUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      border: `1px solid ${pitchBlackTheme.border}`,
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {imageRelation.image.title && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                          p: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          {imageRelation.image.title}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Pricing */}
          {roomType.rates.length > 0 && (
            <Box sx={{ mb: 12 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: pitchBlackTheme.text,
                  mb: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Room Rates
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)'
                  },
                  gap: 6,
                }}
              >
                {roomType.rates.map((rate) => (
                  <Card
                    key={rate.id}
                    sx={{
                      backgroundColor: rate.isDefault ? pitchBlackTheme.selectedBg : pitchBlackTheme.surface,
                      border: `2px solid ${rate.isDefault ? pitchBlackTheme.text : pitchBlackTheme.border}`,
                      borderRadius: 0,
                      p: 5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: pitchBlackTheme.surfaceHover,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 8px 25px ${pitchBlackTheme.shadow}`,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Typography sx={{ 
                        fontWeight: 700, 
                        color: pitchBlackTheme.text, 
                        fontSize: '1.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      }}>
                        {rate.name}
                      </Typography>
                      {rate.isDefault && (
                        <Box
                          sx={{
                            backgroundColor: pitchBlackTheme.text,
                            color: pitchBlackTheme.primary,
                            px: 2,
                            py: 1,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          Default
                        </Box>
                      )}
                    </Box>
                    {rate.description && (
                      <Typography sx={{ 
                        color: pitchBlackTheme.textSecondary, 
                        mb: 4, 
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                      }}>
                        {rate.description}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: '2rem',
                        color: pitchBlackTheme.text,
                        mb: 1,
                        letterSpacing: '-0.02em',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                    >
                      {formatCurrency(rate.baseRate, rate.currency)}
                    </Typography>
                    <Typography sx={{ 
                      color: pitchBlackTheme.textSecondary, 
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 600,
                    }}>
                      per night
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Additional Charges */}
          {(roomType.extraPersonRate || roomType.extraChildRate) && (
            <Box sx={{ mb: 12 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: pitchBlackTheme.text,
                  mb: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Additional Charges
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)'
                  },
                  gap: 6,
                }}
              >
                {roomType.extraPersonRate && (
                  <Card
                    sx={{
                      backgroundColor: pitchBlackTheme.surface,
                      border: `1px solid ${pitchBlackTheme.border}`,
                      borderRadius: 0,
                      p: 5,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: pitchBlackTheme.surfaceHover,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 8px 25px ${pitchBlackTheme.shadow}`,
                      },
                    }}
                  >
                    <Typography sx={{ 
                      fontWeight: 700, 
                      color: pitchBlackTheme.text, 
                      mb: 3,
                      fontSize: '1.125rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}>
                      Extra Person
                    </Typography>
                    <Typography sx={{ 
                      color: pitchBlackTheme.text, 
                      fontSize: '1.75rem', 
                      fontWeight: 900,
                      mb: 1,
                      letterSpacing: '-0.02em',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}>
                      {formatCurrency(roomType.extraPersonRate, defaultRate?.currency || 'PHP')}
                    </Typography>
                    <Typography sx={{ 
                      color: pitchBlackTheme.textSecondary, 
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 600,
                    }}>
                      per night
                    </Typography>
                  </Card>
                )}
                {roomType.extraChildRate && (
                  <Card
                    sx={{
                      backgroundColor: pitchBlackTheme.surface,
                      border: `1px solid ${pitchBlackTheme.border}`,
                      borderRadius: 0,
                      p: 5,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: pitchBlackTheme.surfaceHover,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 8px 25px ${pitchBlackTheme.shadow}`,
                      },
                    }}
                  >
                    <Typography sx={{ 
                      fontWeight: 700, 
                      color: pitchBlackTheme.text, 
                      mb: 3,
                      fontSize: '1.125rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}>
                      Extra Child
                    </Typography>
                    <Typography sx={{ 
                      color: pitchBlackTheme.text, 
                      fontSize: '1.75rem', 
                      fontWeight: 900,
                      mb: 1,
                      letterSpacing: '-0.02em',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}>
                      {formatCurrency(roomType.extraChildRate, defaultRate?.currency || 'PHP')}
                    </Typography>
                    <Typography sx={{ 
                      color: pitchBlackTheme.textSecondary, 
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 600,
                    }}>
                      per night
                    </Typography>
                  </Card>
                )}
              </Box>
            </Box>
          )}

          {/* Availability */}
          <Box sx={{ mb: 12 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: pitchBlackTheme.text,
                mb: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Availability
            </Typography>
            <Card
              sx={{
                backgroundColor: pitchBlackTheme.surface,
                border: `1px solid ${pitchBlackTheme.border}`,
                borderRadius: 0,
                p: 6,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: pitchBlackTheme.surfaceHover,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${pitchBlackTheme.shadow}`,
                },
              }}
            >
              <Typography sx={{ 
                color: pitchBlackTheme.text, 
                fontSize: '1.25rem', 
                mb: 3,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}>
                <strong>{roomType._count.rooms}</strong> rooms of this type available
              </Typography>
              <Typography sx={{ 
                color: pitchBlackTheme.textSecondary,
                fontSize: '1rem',
                lineHeight: 1.6,
              }}>
                Contact us for real-time availability and special rates for extended stays.
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            backgroundColor: pitchBlackTheme.surface,
            p: { xs: 8, md: 12 },
            borderRadius: 0,
            border: `1px solid ${pitchBlackTheme.border}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: pitchBlackTheme.surfaceHover,
              boxShadow: `0 12px 40px ${pitchBlackTheme.shadowMedium}`,
            },
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
              lineHeight: 1.1,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Ready to Book?
          </Typography>
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: '1.125rem',
              lineHeight: 1.6,
              mb: 8,
              maxWidth: '700px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Experience luxury and comfort in our {roomType.displayName}. 
            Book now to secure your perfect getaway.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center">
            <Link href={`/properties/${slug}/rooms/${id}/booking`} passHref>
              <Button
                endIcon={<ArrowForward sx={{ fontSize: 16, transition: 'color 0.3s ease' }} />}
                sx={{
                  backgroundColor: pitchBlackTheme.primary,
                  color: pitchBlackTheme.text,
                  border: `2px solid ${pitchBlackTheme.text}`,
                  px: 10,
                  py: 4,
                  fontSize: '0.875rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  borderRadius: 0,
                  minWidth: '200px',
                  fontFamily: '"Arial Black", "Helvetica", sans-serif',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.primaryHover,
                    borderColor: pitchBlackTheme.primaryHover,
                    color: pitchBlackTheme.primary,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 12px 30px ${pitchBlackTheme.selectedBg}`,
                    '& .MuiSvgIcon-root': {
                      color: pitchBlackTheme.primary,
                    },
                  },
                }}
              >
                Book Now
              </Button>
            </Link>
            <Button
              sx={{
                backgroundColor: pitchBlackTheme.primary,
                color: pitchBlackTheme.text,
                border: `1px solid ${pitchBlackTheme.border}`,
                px: 8,
                py: 4,
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderRadius: 0,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: pitchBlackTheme.text,
                  backgroundColor: pitchBlackTheme.surfaceHover,
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default RoomDetailPage;