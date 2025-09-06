import React from 'react';
import { notFound } from 'next/navigation';
import { Box, Container, Typography, Button, Stack, Divider } from '@mui/material';
import {
  LocationOn,
  ArrowForward,
  People,
  Hotel,
  SquareFoot,
  Balcony,
  Pool,
  Kitchen,
  SmokingRooms,
  Pets,
  Accessible,
  Visibility,
  Weekend,
  CurrencyExchange,
  Groups,
  ChildCare,
  BabyChangingStation,
  CheckCircle,
  LocalOffer,
  EventAvailable,
  Phone,
  Email,
} from '@mui/icons-material';
import Link from 'next/link';
import { getRoomTypeByIdAndProperty } from '@/lib/room-details';

// Enhanced pitch black theme
const pitchBlackTheme = {
  background: '#000000',
  surface: '#000000',
  surfaceHover: '#111111',
  primary: '#000000',
  primaryHover: '#ffffff',
  text: '#ffffff',
  textSecondary: '#6b7280',
  textTertiary: '#4b5563',
  border: '#1a1a1a',
  borderHover: '#333333',
  accent: '#ffffff',
  accentBg: 'rgba(255, 255, 255, 0.08)',
  shadow: 'rgba(255, 255, 255, 0.1)',
  shadowMedium: 'rgba(255, 255, 255, 0.15)',
  shadowStrong: 'rgba(255, 255, 255, 0.25)',
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

  const formatCurrency = (amount: string, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
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

      {/* Hero Section - Full Screen Immersive */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          backgroundImage: `url(${primaryImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: '1000px' }}>
            {/* Room Type Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${pitchBlackTheme.border}`,
                px: 3,
                py: 1.5,
                mb: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: pitchBlackTheme.primaryHover,
                  borderColor: pitchBlackTheme.primaryHover,
                  '& .type-text': {
                    color: pitchBlackTheme.primary,
                  },
                  '& .type-icon': {
                    color: pitchBlackTheme.primary,
                  },
                },
              }}
            >
              <Hotel className="type-icon" sx={{ mr: 1.5, fontSize: '1.2rem', color: 'white', transition: 'color 0.3s ease' }} /> {/* Adjusted icon size */}
              <Typography
                className="type-text"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'color 0.3s ease',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {roomType.businessUnit.displayName}
              </Typography>
            </Box>

            {/* Main title */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' }, /* Adjusted font sizes for responsiveness */
                color: 'white',
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {roomType.displayName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
              <LocationOn sx={{ color: 'white', fontSize: '1.25rem' }} /> {/* Adjusted icon size */}
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
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
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1rem', /* Adjusted font size */
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: '700px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  fontWeight: 400,
                }}
              >
                {roomType.description}
              </Typography>
            )}

            {defaultRate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
                <Box sx={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(10px)',
                  px: 3,
                  py: 2,
                  border: `1px solid ${pitchBlackTheme.border}`,
                }}>
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: { xs: '2rem', md: '2.5rem' }, /* Adjusted font sizes */
                      fontWeight: 900,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      letterSpacing: '-0.02em',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      lineHeight: 1,
                    }}
                  >
                    {formatCurrency(defaultRate.baseRate, defaultRate.currency)}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.875rem', /* Adjusted font size */
                      fontWeight: 600,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      mt: 1,
                    }}
                  >
                    per night
                  </Typography>
                </Box>
              </Box>
            )}

            <Link href={`/properties/${slug}/rooms/${id}/booking`} passHref>
              <Button
                endIcon={<ArrowForward sx={{ fontSize: '1rem', transition: 'color 0.3s ease' }} />}
                sx={{
                  backgroundColor: pitchBlackTheme.primary,
                  color: pitchBlackTheme.text,
                  border: `2px solid ${pitchBlackTheme.text}`,
                  px: 6,
                  py: 2,
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderRadius: 0,
                  minWidth: '200px',
                  fontFamily: '"Arial Black", "Helvetica", sans-serif',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.primaryHover,
                    borderColor: pitchBlackTheme.primaryHover,
                    color: pitchBlackTheme.primary,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 20px ${pitchBlackTheme.shadowStrong}`,
                    '& .MuiSvgIcon-root': {
                      color: pitchBlackTheme.primary,
                    },
                  },
                }}
              >
                Book Now
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        {/* Key Details Section */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' }, /* Adjusted font sizes */
              color: pitchBlackTheme.text,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: 1,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Room Details
          </Typography>

          <Divider sx={{
            backgroundColor: pitchBlackTheme.border,
            mb: 6,
            height: 1,
            '&::before, &::after': {
              borderColor: pitchBlackTheme.border,
              borderWidth: '1px 0 0 0',
            },
          }} />

          {/* Primary Details Row */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 4, lg: 6 },
              mb: 8,
            }}
          >
            {/* Occupancy */}
            <Box
              sx={{
                flex: 1,
                borderLeft: `3px solid ${pitchBlackTheme.text}`, /* Adjusted border thickness */
                pl: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderLeftColor: pitchBlackTheme.accent,
                  transform: 'translateX(3px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: '1.5rem', color: pitchBlackTheme.text, mr: 1.5 }} /> {/* Adjusted icon size */}
                <Typography sx={{
                  fontWeight: 700,
                  color: pitchBlackTheme.text,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}>
                  Occupancy
                </Typography>
              </Box>
              <Typography sx={{
                color: pitchBlackTheme.text,
                fontSize: '1.5rem',
                fontWeight: 900,
                mb: 1.5,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}>
                {roomType.maxOccupancy} Guests
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Groups sx={{ fontSize: '1rem', color: pitchBlackTheme.textSecondary }} />
                  <Typography sx={{
                    color: pitchBlackTheme.textSecondary,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {roomType.maxAdults} Adults
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChildCare sx={{ fontSize: '1rem', color: pitchBlackTheme.textSecondary }} />
                  <Typography sx={{
                    color: pitchBlackTheme.textSecondary,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {roomType.maxChildren} Children
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BabyChangingStation sx={{ fontSize: '1rem', color: pitchBlackTheme.textSecondary }} />
                  <Typography sx={{
                    color: pitchBlackTheme.textSecondary,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {roomType.maxInfants} Infants
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Bed Configuration */}
            {roomType.bedConfiguration && (
              <Box
                sx={{
                  flex: 1,
                  borderLeft: `3px solid ${pitchBlackTheme.text}`,
                  pl: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderLeftColor: pitchBlackTheme.accent,
                    transform: 'translateX(3px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Hotel sx={{ fontSize: '1.5rem', color: pitchBlackTheme.text, mr: 1.5 }} />
                  <Typography sx={{
                    fontWeight: 700,
                    color: pitchBlackTheme.text,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Bedding
                  </Typography>
                </Box>
                <Typography sx={{
                  color: pitchBlackTheme.text,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  lineHeight: 1.3,
                }}>
                  {roomType.bedConfiguration}
                </Typography>
              </Box>
            )}

            {/* Room Size */}
            {roomType.roomSize && (
              <Box
                sx={{
                  flex: 1,
                  borderLeft: `3px solid ${pitchBlackTheme.text}`,
                  pl: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderLeftColor: pitchBlackTheme.accent,
                    transform: 'translateX(3px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SquareFoot sx={{ fontSize: '1.5rem', color: pitchBlackTheme.text, mr: 1.5 }} />
                  <Typography sx={{
                    fontWeight: 700,
                    color: pitchBlackTheme.text,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Space
                  </Typography>
                </Box>
                <Typography sx={{
                  color: pitchBlackTheme.text,
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}>
                  {roomType.roomSize}
                </Typography>
                <Typography sx={{
                  color: pitchBlackTheme.textSecondary,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  mt: 0.5,
                }}>
                  Square Meters
                </Typography>
              </Box>
            )}
          </Box>

          {/* Room Features */}
          <Box sx={{ mb: 8 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.5rem' }, /* Adjusted font sizes */
                color: pitchBlackTheme.text,
                mb: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Room Features
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 2, md: 3 },
              }}
            >
              {roomType.hasBalcony && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  borderBottom: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderBottomColor: pitchBlackTheme.text,
                    transform: 'translateY(-1px)',
                  },
                }}>
                  <Balcony sx={{ color: pitchBlackTheme.text, fontSize: '1.5rem' }} />
                  <Typography sx={{
                    color: pitchBlackTheme.text,
                    fontWeight: 700,
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
                  gap: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  borderBottom: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderBottomColor: pitchBlackTheme.text,
                    transform: 'translateY(-1px)',
                  },
                }}>
                  <Visibility sx={{ color: pitchBlackTheme.text, fontSize: '1.5rem' }} />
                  <Typography sx={{
                    color: pitchBlackTheme.text,
                    fontWeight: 700,
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
                  gap: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  borderBottom: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderBottomColor: pitchBlackTheme.text,
                    transform: 'translateY(-1px)',
                  },
                }}>
                  <Pool sx={{ color: pitchBlackTheme.text, fontSize: '1.5rem' }} />
                  <Typography sx={{
                    color: pitchBlackTheme.text,
                    fontWeight: 700,
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
                  gap: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  borderBottom: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderBottomColor: pitchBlackTheme.text,
                    transform: 'translateY(-1px)',
                  },
                }}>
                  <Kitchen sx={{ color: pitchBlackTheme.text, fontSize: '1.5rem' }} />
                  <Typography sx={{
                    color: pitchBlackTheme.text,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Full Kitchenette
                  </Typography>
                </Box>
              )}
              {roomType.hasLivingArea && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  borderBottom: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderBottomColor: pitchBlackTheme.text,
                    transform: 'translateY(-1px)',
                  },
                }}>
                  <Weekend sx={{ color: pitchBlackTheme.text, fontSize: '1.5rem' }} />
                  <Typography sx={{
                    color: pitchBlackTheme.text,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Separate Living Area
                  </Typography>
                </Box>
              )}
              {roomType.smokingAllowed && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  borderBottom: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderBottomColor: pitchBlackTheme.textSecondary,
                    transform: 'translateY(-1px)',
                  },
                }}>
                  <SmokingRooms sx={{ color: pitchBlackTheme.textSecondary, fontSize: '1.5rem' }} />
                  <Typography sx={{
                    color: pitchBlackTheme.textSecondary,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Smoking Permitted
                  </Typography>
                </Box>
              )}
              {roomType.petFriendly && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  borderBottom: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderBottomColor: pitchBlackTheme.text,
                    transform: 'translateY(-1px)',
                  },
                }}>
                  <Pets sx={{ color: pitchBlackTheme.text, fontSize: '1.5rem' }} />
                  <Typography sx={{
                    color: pitchBlackTheme.text,
                    fontWeight: 700,
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
                  gap: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  borderBottom: `1px solid ${pitchBlackTheme.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderBottomColor: pitchBlackTheme.text,
                    transform: 'translateY(-1px)',
                  },
                }}>
                  <Accessible sx={{ color: pitchBlackTheme.text, fontSize: '1.5rem' }} />
                  <Typography sx={{
                    color: pitchBlackTheme.text,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Fully Accessible
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Amenities Section */}
          {roomType.amenities.length > 0 && (
            <Box sx={{ mb: 8 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' }, /* Adjusted font sizes */
                  color: pitchBlackTheme.text,
                  mb: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Room Amenities
              </Typography>

              {/* Converted to a responsive grid layout */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr', // Single column on extra small screens
                    sm: 'repeat(2, 1fr)', // Two columns on small screens and up
                    md: 'repeat(3, 1fr)', // Three columns on medium screens and up
                  },
                  gap: 4, // Added consistent gap for a clean grid look
                }}
              >
                {roomType.amenities.map((amenityRelation, index) => (
                  <Box
                    key={amenityRelation.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 3, // Added padding to create a box-like appearance
                      border: `1px solid ${pitchBlackTheme.border}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: `1px solid ${pitchBlackTheme.text}`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 20px ${pitchBlackTheme.shadowMedium}`,
                      },
                    }}
                  >
                    <CheckCircle
                      sx={{
                        color: pitchBlackTheme.text,
                        fontSize: '1.25rem',
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography sx={{
                        fontWeight: 700,
                        color: pitchBlackTheme.text,
                        fontSize: '1.125rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        mb: 1,
                      }}>
                        {amenityRelation.amenity.name}
                      </Typography>
                      {amenityRelation.amenity.description && (
                        <Typography sx={{
                          color: pitchBlackTheme.textSecondary,
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        }}>
                          {amenityRelation.amenity.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Pricing Section */}
          {roomType.rates.length > 0 && (
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <LocalOffer sx={{ fontSize: '1.5rem', color: pitchBlackTheme.text }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.5rem' }, /* Adjusted font sizes */
                    color: pitchBlackTheme.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Rate Options
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {roomType.rates.map((rate) => (
                  <Box
                    key={rate.id}
                    sx={{
                      position: 'relative',
                      backgroundColor: rate.isDefault ? pitchBlackTheme.accentBg : 'transparent',
                      border: `2px solid ${rate.isDefault ? pitchBlackTheme.text : pitchBlackTheme.border}`,
                      p: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: pitchBlackTheme.text,
                        backgroundColor: pitchBlackTheme.accentBg,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 20px ${pitchBlackTheme.shadowMedium}`,
                      },
                      // CHANGE 1: Prevents the box from stretching to full width and centers it
                      alignSelf: 'center',
                    }}
                  >
                    {rate.isDefault && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          backgroundColor: pitchBlackTheme.text,
                          color: pitchBlackTheme.primary,
                          px: 2,
                          py: 1,
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        }}
                      >
                        Best Rate
                      </Box>
                    )}

                    {/* CHANGE 2: Reverted to space-between for the internal layout */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                        mt: 4,
                        gap: 2, // Added gap for spacing
                      }}
                    >
                      <Box>
                        <Typography sx={{
                          fontWeight: 700,
                          color: pitchBlackTheme.text,
                          fontSize: '1.25rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          mb: 1,
                        }}>
                          {rate.name}
                        </Typography>
                        {rate.description && (
                          <Typography sx={{
                            color: pitchBlackTheme.textSecondary,
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            maxWidth: '500px',
                          }}>
                            {rate.description}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 900,
                            fontSize: '2rem',
                            color: pitchBlackTheme.text,
                            mb: 0.5,
                            letterSpacing: '-0.02em',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            lineHeight: 1,
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
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Additional Charges */}
          {(roomType.extraPersonRate || roomType.extraChildRate) && (
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <CurrencyExchange sx={{ fontSize: '1.5rem', color: pitchBlackTheme.text }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.5rem' }, /* Adjusted font sizes */
                    color: pitchBlackTheme.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Additional Rates
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: 'row' },
                  gap: 4,
                }}
              >
                {roomType.extraPersonRate && (
                  <Box
                    sx={{
                      flex: 1,
                      borderLeft: `3px solid ${pitchBlackTheme.text}`,
                      pl: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderLeftColor: pitchBlackTheme.accent,
                        transform: 'translateX(3px)',
                      },
                    }}
                  >
                    <Typography sx={{
                      fontWeight: 700,
                      color: pitchBlackTheme.text,
                      mb: 1.5,
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}>
                      Extra Person
                    </Typography>
                    <Typography sx={{
                      color: pitchBlackTheme.text,
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      mb: 1,
                      letterSpacing: '-0.02em',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      lineHeight: 1,
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
                  </Box>
                )}
                {roomType.extraChildRate && (
                  <Box
                    sx={{
                      flex: 1,
                      borderLeft: `3px solid ${pitchBlackTheme.text}`,
                      pl: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderLeftColor: pitchBlackTheme.accent,
                        transform: 'translateX(3px)',
                      },
                    }}
                  >
                    <Typography sx={{
                      fontWeight: 700,
                      color: pitchBlackTheme.text,
                      mb: 1.5,
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}>
                      Extra Child
                    </Typography>
                    <Typography sx={{
                      color: pitchBlackTheme.text,
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      mb: 1,
                      letterSpacing: '-0.02em',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      lineHeight: 1,
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
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Availability Status */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <EventAvailable sx={{ fontSize: '1.5rem', color: pitchBlackTheme.text }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' }, /* Adjusted font sizes */
                  color: pitchBlackTheme.text,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Availability
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: pitchBlackTheme.accentBg,
                border: `2px solid ${pitchBlackTheme.text}`,
                p: 6,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: pitchBlackTheme.surfaceHover,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 20px ${pitchBlackTheme.shadowMedium}`,
                },
              }}
            >
              <Typography sx={{
                color: pitchBlackTheme.text,
                fontSize: '1.5rem',
                mb: 2,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}>
                {roomType._count.rooms} Rooms Available
              </Typography>
              <Typography sx={{
                color: pitchBlackTheme.textSecondary,
                fontSize: '0.875rem',
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
              }}>
                Limited availability - Reserve your room now for the ultimate hospitality experience.
                Contact our frontdesk for real-time availability and exclusive packages.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Final CTA Section */}
        <Box
          sx={{
            position: 'relative',
            textAlign: 'center',
            backgroundColor: 'transparent',
            py: 10,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${primaryImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              opacity: 0.1,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                color: pitchBlackTheme.text,
                mb: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: 0.9,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Experience Luxury
            </Typography>
            <Typography
              sx={{
                color: pitchBlackTheme.textSecondary,
                fontSize: '1rem',
                lineHeight: 1.6,
                mb: 6,
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Your extraordinary getaway awaits in our {roomType.displayName}.
              Indulge in unparalleled comfort, breathtaking views, and world-class amenities
              that redefine luxury hospitality.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <Link href={`/properties/${slug}/rooms/${id}/booking`} passHref>
                <Button
                  endIcon={<ArrowForward sx={{ fontSize: '1rem', transition: 'color 0.3s ease' }} />}
                  sx={{
                    backgroundColor: pitchBlackTheme.primary,
                    color: pitchBlackTheme.text,
                    border: `2px solid ${pitchBlackTheme.text}`,
                    px: 6,
                    py: 2,
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    borderRadius: 0,
                    minWidth: '200px',
                    fontFamily: '"Arial Black", "Helvetica", sans-serif',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: pitchBlackTheme.primaryHover,
                      borderColor: pitchBlackTheme.primaryHover,
                      color: pitchBlackTheme.primary,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 20px ${pitchBlackTheme.shadowStrong}`,
                      '& .MuiSvgIcon-root': {
                        color: pitchBlackTheme.primary,
                      },
                    },
                  }}
                >
                  Book Your Stay
                </Button>
              </Link>

              <Button
                startIcon={<Phone sx={{ fontSize: '1rem' }} />}
                sx={{
                  backgroundColor: 'transparent',
                  color: pitchBlackTheme.text,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  px: 5,
                  py: 2,
                  fontSize: '0.9rem',
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
                Call Frontdesk
              </Button>
            </Stack>

            {/* Quick Contact Info */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                gap: { xs: 2, md: 6 },
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: pitchBlackTheme.textSecondary, fontSize: '1.2rem' }} />
                <Typography sx={{
                  color: pitchBlackTheme.textSecondary,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  +63 xxx xxx xxxx
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: pitchBlackTheme.textSecondary, fontSize: '1.2rem' }} />
                <Typography sx={{
                  color: pitchBlackTheme.textSecondary,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}>
                  reservations@hotel.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RoomDetailPage;