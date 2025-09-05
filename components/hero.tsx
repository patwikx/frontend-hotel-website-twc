'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import { ArrowForward, Star, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroData, incrementHeroView, incrementHeroClick } from '../lib/actions/heroes';

// Pitch black theme matching other components
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
  warning: '#f59e0b',
};

interface HeroProps {
  heroesData?: HeroData[] | null;
}

const Hero: React.FC<HeroProps> = ({ heroesData }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [direction, setDirection] = useState(1);
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

  const defaultHero: Partial<HeroData> = {
    title: 'Experience Luxury\nBeyond Imagination',
    subtitle: 'Award-winning luxury hospitality since 1995',
    description: 'Discover our world-class hotels and resorts across breathtaking locations. Where every moment becomes an unforgettable memory.',
    backgroundImage: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    primaryButtonText: 'Explore Our Properties',
    primaryButtonUrl: '/properties',
    secondaryButtonText: 'View Special Offers',
    secondaryButtonUrl: '/offers',
    textAlignment: 'center',
    overlayOpacity: 0.6,
    textColor: pitchBlackTheme.text,
  };

  const heroes = heroesData && heroesData.length > 0 ? heroesData : [defaultHero];
  const currentHero = heroes[currentHeroIndex];

  // Auto-rotate heroes with smooth transitions
  useEffect(() => {
    if (heroes.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentHeroIndex((prev) => (prev + 1) % heroes.length);
      }, 8000); // Change hero every 8 seconds

      return () => clearInterval(interval);
    }
  }, [heroes.length]);

  // Track view for current hero
  useEffect(() => {
    if (currentHero && 'id' in currentHero && currentHero.id) {
      incrementHeroView(currentHero.id).catch(console.error);
    }
  }, [currentHero]);

  const handleButtonClick = async (url?: string | null) => {
    if (currentHero && 'id' in currentHero && currentHero.id) {
      try {
        await incrementHeroClick(currentHero.id);
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    }
    
    if (url) {
      window.location.href = url;
    }
  };

  const handlePrevHero = () => {
    setDirection(-1);
    setCurrentHeroIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
  };

  const handleNextHero = () => {
    setDirection(1);
    setCurrentHeroIndex((prev) => (prev + 1) % heroes.length);
  };

  const handleIndicatorClick = (index: number) => {
    setDirection(index > currentHeroIndex ? 1 : -1);
    setCurrentHeroIndex(index);
  };

  // Mobile-friendly animation variants
  const contentVariants = {
    enter: {
      opacity: 0,
      y: isMobile ? 30 : 50, // Reduced movement on mobile
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: isMobile ? -30 : -50, // Reduced movement on mobile
    },
  };

  const backgroundVariants = {
    enter: {
      scale: 1.05, // Reduced scale change on mobile
      opacity: 0,
    },
    center: {
      scale: 1,
      opacity: 1,
    },
    exit: {
      scale: 0.95, // Reduced scale change on mobile
      opacity: 0,
    },
  };

  const titleParts = currentHero.title?.split('\n') || ['Experience Luxury', 'Beyond Imagination'];
  
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: currentHero.displayType === 'banner' ? '60vh' : '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: pitchBlackTheme.background,
        width: '100%',
      }}
    >
      {/* Animated Background Container - Fixed for mobile */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`background-${currentHeroIndex}`}
          custom={direction}
          variants={backgroundVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: isMobile ? 0.8 : 1.2, // Faster on mobile
            ease: [0.4, 0.0, 0.2, 1],
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          {/* Background Image - Fixed positioning for mobile */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: currentHero.backgroundImage ? `url(${currentHero.backgroundImage})` : `url(${defaultHero.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              // Fixed: Remove background-attachment: fixed on mobile to prevent disappearing
              backgroundAttachment: isMobile ? 'scroll' : 'fixed',
              zIndex: 0,
            }}
          />

          {/* Overlay - Enhanced for pitch black theme */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: currentHero.overlayColor || `rgba(0, 0, 0, ${currentHero.overlayOpacity || 0.6})`,
              zIndex: 2,
            }}
          />

          {/* Background Video */}
          {currentHero.backgroundVideo && (
            <Box
              component="video"
              autoPlay
              muted
              loop
              playsInline // Important for mobile
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1,
              }}
            >
              <source src={currentHero.backgroundVideo} type="video/mp4" />
            </Box>
          )}
          
          {/* Overlay Image */}
          {currentHero.overlayImage && (
            <Box
              component="img"
              src={currentHero.overlayImage}
              alt={currentHero.altText || currentHero.title || ''}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 2,
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows for multiple heroes - Mobile optimized */}
      {heroes.length > 1 && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <IconButton
              onClick={handlePrevHero}
              sx={{
                position: 'absolute',
                left: { xs: 10, md: 20 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                backgroundColor: pitchBlackTheme.surface,
                color: pitchBlackTheme.text,
                border: `1px solid ${pitchBlackTheme.border}`,
                backdropFilter: 'blur(10px)',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                '&:hover': {
                  backgroundColor: pitchBlackTheme.primaryHover,
                  borderColor: pitchBlackTheme.primaryHover,
                  color: pitchBlackTheme.primary,
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowBackIos />
            </IconButton>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <IconButton
              onClick={handleNextHero}
              sx={{
                position: 'absolute',
                right: { xs: 10, md: 20 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                backgroundColor: pitchBlackTheme.surface,
                color: pitchBlackTheme.text,
                border: `1px solid ${pitchBlackTheme.border}`,
                backdropFilter: 'blur(10px)',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                '&:hover': {
                  backgroundColor: pitchBlackTheme.primaryHover,
                  borderColor: pitchBlackTheme.primaryHover,
                  color: pitchBlackTheme.primary,
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </motion.div>
        </>
      )}

      {/* Hero indicators for multiple heroes - Mobile optimized */}
      {heroes.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            position: 'absolute',
            bottom: isMobile ? 20 : 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            gap: isMobile ? 8 : 12,
          }}
        >
          {heroes.map((_, index) => (
            <motion.div
              key={index}
              onClick={() => handleIndicatorClick(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: isMobile ? 10 : 12,
                height: isMobile ? 10 : 12,
                borderRadius: '50%',
                backgroundColor: index === currentHeroIndex ? pitchBlackTheme.text : pitchBlackTheme.textSecondary,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                border: `1px solid ${pitchBlackTheme.border}`,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Animated Content Container */}
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 3,
          textAlign: currentHero.textAlignment || 'center',
          color: currentHero.textColor || pitchBlackTheme.text,
          px: { xs: 2, md: 4 },
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`content-${currentHeroIndex}`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: isMobile ? 0.6 : 0.8, // Faster on mobile
              ease: [0.4, 0.0, 0.2, 1],
              delay: isMobile ? 0.1 : 0.2, // Reduced delay on mobile
            }}
          >
            {currentHero.subtitle && (
              <Box sx={{ mb: 3 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: isMobile ? 0.2 : 0.4, duration: 0.6 }}
                >
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    justifyContent={currentHero.textAlignment === 'left' ? 'flex-start' : currentHero.textAlignment === 'right' ? 'flex-end' : 'center'} 
                    alignItems="center" 
                    sx={{ mb: 2 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: (isMobile ? 0.3 : 0.5) + i * 0.1, duration: 0.5 }}
                      >
                        <Star sx={{ color: pitchBlackTheme.warning, fontSize: { xs: 20, md: 24 } }} />
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isMobile ? 0.4 : 0.6, duration: 0.6 }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: pitchBlackTheme.textSecondary, 
                      mb: 3, 
                      textTransform: 'uppercase', 
                      fontWeight: 600, 
                      letterSpacing: { xs: 1, md: 2 },
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    {currentHero.subtitle}
                  </Typography>
                </motion.div>
              </Box>
            )}

            <motion.div
              initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.2 : 0.3, duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                  lineHeight: { xs: 1.1, md: 1.1 },
                  color: currentHero.textColor || pitchBlackTheme.text,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {titleParts[0]}
                {titleParts[1] && (
                  <>
                    <br />
                    <Box component="span" sx={{ color: pitchBlackTheme.textSecondary }}>
                      {titleParts[1]}
                    </Box>
                  </>
                )}
              </Typography>
            </motion.div>

            {currentHero.description && (
              <motion.div
                initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 0.3 : 0.5, duration: 0.8 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 5,
                    color: pitchBlackTheme.textSecondary,
                    maxWidth: 600,
                    mx: currentHero.textAlignment === 'center' ? 'auto' : 0,
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontWeight: 400,
                  }}
                >
                  {currentHero.description}
                </Typography>
              </motion.div>
            )}

            {(currentHero.primaryButtonText || currentHero.secondaryButtonText) && (
              <motion.div
                initial={{ opacity: 0, y: isMobile ? 30 : 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 0.4 : 0.7, duration: 0.8 }}
              >
                <Stack
                  direction={isMobile ? 'column' : 'row'}
                  spacing={3}
                  justifyContent={currentHero.textAlignment === 'left' ? 'flex-start' : currentHero.textAlignment === 'right' ? 'flex-end' : 'center'}
                  alignItems="center"
                >
                  {currentHero.primaryButtonText && (
                    <motion.div
                      whileHover={{ scale: isMobile ? 1.02 : 1.05, y: isMobile ? -2 : -5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={() => handleButtonClick(currentHero.primaryButtonUrl)}
                        sx={{
                          backgroundColor: pitchBlackTheme.primary,
                          color: pitchBlackTheme.text,
                          border: `2px solid ${pitchBlackTheme.text}`,
                          px: { xs: 4, md: 5 },
                          py: { xs: 2, md: 2.5 },
                          fontSize: { xs: '0.8rem', md: '0.9rem' },
                          fontWeight: 900,
                          borderRadius: 0,
                          textTransform: 'uppercase',
                          letterSpacing: '0.15em',
                          minWidth: { xs: '180px', md: '200px' },
                          fontFamily: '"Arial Black", "Helvetica", sans-serif',
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: pitchBlackTheme.primaryHover,
                            borderColor: pitchBlackTheme.primaryHover,
                            color: pitchBlackTheme.primary,
                            boxShadow: `0 4px 12px ${pitchBlackTheme.selectedBg}`,
                            '& .MuiSvgIcon-root': {
                              color: pitchBlackTheme.primary,
                            },
                          },
                          transition: 'all 0.3s ease-in-out',
                        }}
                      >
                        {currentHero.primaryButtonText}
                      </Button>
                    </motion.div>
                  )}
                  
                  {currentHero.secondaryButtonText && (
                    <motion.div
                      whileHover={{ scale: isMobile ? 1.02 : 1.05, y: isMobile ? -2 : -5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => handleButtonClick(currentHero.secondaryButtonUrl)}
                        sx={{
                          backgroundColor: 'transparent',
                          borderColor: pitchBlackTheme.text,
                          color: pitchBlackTheme.text,
                          px: { xs: 4, md: 5 },
                          py: { xs: 2, md: 2.5 },
                          fontSize: { xs: '0.8rem', md: '0.9rem' },
                          fontWeight: 900,
                          borderRadius: 0,
                          borderWidth: 2,
                          textTransform: 'uppercase',
                          letterSpacing: '0.15em',
                          minWidth: { xs: '180px', md: '200px' },
                          fontFamily: '"Arial Black", "Helvetica", sans-serif',
                          '&:hover': {
                            backgroundColor: pitchBlackTheme.selectedBg,
                            borderColor: pitchBlackTheme.text,
                            borderWidth: 2,
                          },
                          transition: 'all 0.3s ease-in-out',
                        }}
                      >
                        {currentHero.secondaryButtonText}
                      </Button>
                    </motion.div>
                  )}
                </Stack>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default Hero;