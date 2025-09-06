'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ArrowForward,
  ExpandMore,
} from '@mui/icons-material';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import { BusinessUnitData } from '@/lib/actions/business-units';

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
};

// Interface for website configuration data
interface WebsiteConfigData {
  siteName: string;
  logo: string | null;
  primaryPhone: string | null;
  primaryEmail: string | null;
}

// Header now accepts both business units and website config as props
interface HeaderProps {
  businessUnits: BusinessUnitData[];
  websiteConfig: WebsiteConfigData | null;
}

// Skeleton Item Component
const SkeletonPropertyItem: React.FC<{ index: number }> = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      delay: 0.1 + index * 0.05, 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }}
    style={{ width: '100%' }}
  >
    <Box
      sx={{
        width: '100%',
        p: 3,
        borderRadius: 0,
        border: `1px solid ${pitchBlackTheme.border}`,
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: pitchBlackTheme.surface,
      }}
    >
      <Skeleton
        variant="text"
        sx={{
          fontSize: '1rem',
          mb: 1,
          backgroundColor: pitchBlackTheme.border,
          '&::after': {
            background: `linear-gradient(90deg, transparent, ${pitchBlackTheme.textSecondary}40, transparent)`,
          },
        }}
        width="80%"
      />
      <Skeleton
        variant="text"
        sx={{
          fontSize: '0.875rem',
          backgroundColor: pitchBlackTheme.border,
          '&::after': {
            background: `linear-gradient(90deg, transparent, ${pitchBlackTheme.textSecondary}40, transparent)`,
          },
        }}
        width="60%"
      />
    </Box>
  </motion.div>
);

const Header: React.FC<HeaderProps> = ({ businessUnits, websiteConfig }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const propertiesButtonRef = useRef<HTMLButtonElement>(null);

  const isLoading = !businessUnits || businessUnits.length === 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        propertiesButtonRef.current &&
        !propertiesButtonRef.current.contains(event.target as Node)
      ) {
        setPropertiesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, propertiesButtonRef]);

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
    setMobilePropertiesOpen(false);
  };

  const handlePropertiesToggle = () => {
    setPropertiesDropdownOpen(!propertiesDropdownOpen);
  };

  const handleMobilePropertiesToggle = () => {
    setMobilePropertiesOpen(!mobilePropertiesOpen);
  };

  const handlePropertyClick = (slug: string) => {
    setPropertiesDropdownOpen(false);
    setMobileDrawerOpen(false);
    setMobilePropertiesOpen(false);
    window.location.href = `/properties/${slug}`;
  };

  const handleViewAllProperties = () => {
    setPropertiesDropdownOpen(false);
    setMobileDrawerOpen(false);
    setMobilePropertiesOpen(false);
    window.location.href = '/properties';
  };

  const navigationItems = [
    { name: 'Properties', href: '/properties' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Events', href: '/events' },
    { name: 'Offers', href: '/special-offers' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const formatLocation = (businessUnit: BusinessUnitData): string => {
    const parts = [businessUnit.city, businessUnit.state, businessUnit.country]
      .filter(part => part)
      .filter(Boolean);
    return parts.join(', ');
  };

  const drawerVariants: Variants = {
    closed: {
      opacity: 0,
      y: -20,
    },
    open: {
      opacity: 1,
      y: 0,
    },
  };

  const menuItemVariants: Variants = {
    closed: {
      opacity: 0,
      x: -50,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  };

  const propertiesListVariants: Variants = {
    closed: {
      opacity: 0,
      height: 0,
    },
    open: {
      opacity: 1,
      height: 'auto',
    },
  };

  const drawerContent = (
    <motion.div
      variants={drawerVariants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundColor: pitchBlackTheme.background,
          color: pitchBlackTheme.text,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 3,
          }}
        >
          <motion.div
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <IconButton
              onClick={handleMobileDrawerToggle}
              sx={{
                color: pitchBlackTheme.text,
                backgroundColor: pitchBlackTheme.surface,
                border: `1px solid ${pitchBlackTheme.border}`,
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: pitchBlackTheme.primaryHover,
                  borderColor: pitchBlackTheme.primaryHover,
                  color: pitchBlackTheme.primary,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </motion.div>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Box sx={{ px: 4 }}>
            <Button
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                p: 0,
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Image 
                src={websiteConfig?.logo || "https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCV0y3FUvkBwoHGKNiCbEI9uWYstSRk5rXgMLfx"} 
                height={60} 
                width={60} 
                alt={websiteConfig?.siteName || "TWC Logo"} 
                className='mr-4' 
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: pitchBlackTheme.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Tropicana
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: pitchBlackTheme.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Worldwide
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: pitchBlackTheme.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Corporation
                </Typography>
              </Box>
            </Button>
            <Typography
              sx={{
                color: pitchBlackTheme.textSecondary,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                whiteSpace: 'nowrap',
              }}
            >
              Premium Hospitality
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ flex: 1, px: 4, overflow: 'auto' }}>
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.name}
              variants={menuItemVariants}
              initial="closed"
              animate="open"
              transition={{
                delay: index * 0.1 + 0.2,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {item.name === 'Properties' ? (
                <Box>
                  <Button
                    onClick={handleMobilePropertiesToggle}
                    endIcon={
                      <ExpandMore
                        sx={{
                          transform: mobilePropertiesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    }
                    sx={{
                      width: '100%',
                      textAlign: 'left',
                      justifyContent: 'space-between',
                      py: 3,
                      px: 0,
                      color: pitchBlackTheme.text,
                      fontSize: '2rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: pitchBlackTheme.textSecondary,
                        transform: 'translateX(20px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: pitchBlackTheme.textSecondary,
                          mr: 3,
                          minWidth: '40px',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        01
                      </Typography>
                      Properties
                    </Box>
                  </Button>
                  
                  <AnimatePresence>
                    {mobilePropertiesOpen && (
                      <motion.div
                        variants={propertiesListVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Box sx={{ pl: 6, pb: 2 }}>
                          {businessUnits.map((property, propIndex) => (
                            <motion.div
                              key={property.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: propIndex * 0.05,
                                duration: 0.3 
                              }}
                            >
                              <Button
                                onClick={() => handlePropertyClick(property.slug)}
                                sx={{
                                  width: '100%',
                                  textAlign: 'left',
                                  justifyContent: 'flex-start',
                                  py: 2,
                                  px: 2,
                                  color: pitchBlackTheme.textSecondary,
                                  fontSize: '0.9rem',
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.02em',
                                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                                  transition: 'all 0.3s ease',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  borderRadius: '4px',
                                  mx: 1,
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: pitchBlackTheme.primaryHover,
                                    transform: 'translateX(-100%)',
                                    transition: 'transform 0.3s ease',
                                    zIndex: 0,
                                  },
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: pitchBlackTheme.text,
                                    transform: 'translateX(8px)',
                                    '&::before': {
                                      transform: 'translateX(0%)',
                                    },
                                    '& .mobile-property-name': {
                                      color: pitchBlackTheme.primary,
                                    },
                                    '& .mobile-property-location': {
                                      color: pitchBlackTheme.primary,
                                    },
                                  },
                                }}
                              >
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                  <Typography
                                    className="mobile-property-name"
                                    sx={{
                                      fontSize: '0.9rem',
                                      fontWeight: 600,
                                      color: 'inherit',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.02em',
                                      transition: 'color 0.3s ease',
                                    }}
                                  >
                                    {property.displayName}
                                  </Typography>
                                  <Typography
                                    className="mobile-property-location"
                                    sx={{
                                      fontSize: '0.7rem',
                                      color: pitchBlackTheme.textSecondary,
                                      fontWeight: 400,
                                      textTransform: 'none',
                                      mt: 0.5,
                                      transition: 'color 0.3s ease',
                                    }}
                                  >
                                    {formatLocation(property)}
                                  </Typography>
                                </Box>
                              </Button>
                            </motion.div>
                          ))}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: businessUnits.length * 0.05,
                              duration: 0.3 
                            }}
                          >
                            <Button
                              onClick={handleViewAllProperties}
                              sx={{
                                width: '100%',
                                textAlign: 'center',
                                justifyContent: 'center',
                                py: 2,
                                px: 0,
                                mt: 1,
                                color: pitchBlackTheme.text,
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em',
                                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                                transition: 'all 0.3s ease',
                                border: `1px solid ${pitchBlackTheme.border}`,
                                borderRadius: 0,
                                '&:hover': {
                                  backgroundColor: pitchBlackTheme.primaryHover,
                                  color: pitchBlackTheme.primary,
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            >
                              VIEW ALL PROPERTIES
                            </Button>
                          </motion.div>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              ) : (
                <Button
                  onClick={handleMobileDrawerToggle}
                  href={item.href}
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    py: 3,
                    px: 0,
                    color: pitchBlackTheme.text,
                    fontSize: '2rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: pitchBlackTheme.textSecondary,
                      transform: 'translateX(20px)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: pitchBlackTheme.textSecondary,
                      mr: 3,
                      minWidth: '40px',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  {item.name}
                </Button>
              )}
            </motion.div>
          ))}
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Box sx={{ p: 3 }}>
            <Button
              endIcon={<ArrowForward />}
              onClick={handleMobileDrawerToggle}
              href="/reservations"
              sx={{
                width: '100%',
                backgroundColor: pitchBlackTheme.primary,
                color: pitchBlackTheme.text,
                border: `2px solid ${pitchBlackTheme.text}`,
                py: 2.5,
                fontSize: '0.9rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderRadius: 0,
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: pitchBlackTheme.primaryHover,
                  borderColor: pitchBlackTheme.primaryHover,
                  color: pitchBlackTheme.primary,
                  transform: 'translateY(-3px)',
                  boxShadow: `0 12px 24px ${pitchBlackTheme.selectedBg}`,
                },
              }}
            >
              Book Your Experience
            </Button>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: pitchBlackTheme.background,
          transition: 'all 0.3s ease',
          borderBottom: `1px solid ${pitchBlackTheme.border}`,
          boxShadow: isScrolled 
            ? `0 4px 20px ${pitchBlackTheme.selectedBg}` 
            : `0 2px 10px ${pitchBlackTheme.shadow}`,
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        }}
      >
        <Container maxWidth="xl" sx={{ backgroundColor: 'transparent' }}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              py: 2,
              minHeight: '120px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                href="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 0,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <Image 
                  src={websiteConfig?.logo || "https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCV0y3FUvkBwoHGKNiCbEI9uWYstSRk5rXgMLfx"} 
                  height={60} 
                  width={60} 
                  alt={websiteConfig?.siteName || "TWC Logo"} 
                  className='mr-4' 
                />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: pitchBlackTheme.text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      lineHeight: 1.1,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    Tropicana<br />Worldwide<br />Corporation
                  </Typography>
                </Box>
              </Button>
            </motion.div>

            {isMobile ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <IconButton
                  onClick={handleMobileDrawerToggle}
                  sx={{
                    color: pitchBlackTheme.text,
                    backgroundColor: pitchBlackTheme.surface,
                    border: `1px solid ${pitchBlackTheme.border}`,
                    borderRadius: 0,
                    p: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: pitchBlackTheme.primaryHover,
                      borderColor: pitchBlackTheme.primaryHover,
                      color: pitchBlackTheme.primary,
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <MenuIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      position: 'relative',
                    }}
                  >
                    <Button
                      ref={propertiesButtonRef}
                      onClick={handlePropertiesToggle}
                      sx={{
                        color: pitchBlackTheme.textSecondary,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        px: 3,
                        py: 2,
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          color: pitchBlackTheme.text,
                          backgroundColor: 'transparent',
                          transform: 'translateY(-2px)',
                          '&::after': {
                            width: '100%',
                            opacity: 1,
                          },
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: '2px',
                          backgroundColor: pitchBlackTheme.text,
                          transition: 'all 0.3s ease',
                          opacity: 0,
                        },
                      }}
                    >
                      Properties
                    </Button>
                    
                    {/* Fixed Dropdown - Removed layout animation and scale to prevent flickering */}
                    <AnimatePresence>
                      {propertiesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ 
                            duration: 0.25,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                          style={{ position: 'absolute', zIndex: 1300 }}
                        >
                          <Paper
                            ref={dropdownRef}
                            sx={{
                              position: 'absolute',
                              top: '100%',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              mt: 6,
                              width: '800px',
                              backgroundColor: pitchBlackTheme.surface,
                              boxShadow: `0 20px 40px ${pitchBlackTheme.selectedBg}`,
                              borderRadius: 0,
                              border: `1px solid ${pitchBlackTheme.border}`,
                              transformOrigin: 'top center',
                            }}
                          >
                            <Box sx={{ p: 4, pb: 2 }}>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                              >
                                <Box sx={{ mb: 4 }}>
                                  <Typography
                                    sx={{
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      color: pitchBlackTheme.textSecondary,
                                      textTransform: 'uppercase',
                                      letterSpacing: '2px',
                                      mb: 1,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    Our Properties
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '1.8rem',
                                      color: pitchBlackTheme.text,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.02em',
                                      lineHeight: 1.1,
                                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    Premium Hotels & Resorts
                                  </Typography>
                                </Box>
                              </motion.div>

                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(2, 1fr)',
                                  gap: 2,
                                  width: '100%',
                                }}
                              >
                                {isLoading ? (
                                  Array.from({ length: 4 }).map((_, index) => (
                                    <SkeletonPropertyItem key={`skeleton-${index}`} index={index} />
                                  ))
                                ) : (
                                  businessUnits.map((property, index) => (
                                    <motion.div
                                      key={property.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ 
                                        delay: 0.1 + index * 0.08, 
                                        duration: 0.5,
                                        ease: [0.4, 0, 0.2, 1]
                                      }}
                                      style={{ width: '100%' }}
                                    >
                                      <Box
                                        onClick={() => handlePropertyClick(property.slug)}
                                        sx={{
                                          width: '100%',
                                          cursor: 'pointer',
                                          p: 3,
                                          borderRadius: 0,
                                          border: `1px solid transparent`,
                                          transition: 'all 0.3s ease',
                                          position: 'relative',
                                          overflow: 'hidden',
                                          minHeight: '120px',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          justifyContent: 'center',
                                          '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: pitchBlackTheme.primaryHover,
                                            transform: 'translateX(-100%)',
                                            transition: 'transform 0.3s ease',
                                            zIndex: 0,
                                          },
                                          '&:hover': {
                                            borderColor: pitchBlackTheme.primaryHover,
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${pitchBlackTheme.selectedBg}`,
                                            '&::before': {
                                              transform: 'translateX(0%)',
                                            },
                                            '& .property-name': {
                                              color: pitchBlackTheme.primary,
                                            },
                                            '& .property-location': {
                                              color: pitchBlackTheme.primary,
                                            },
                                          },
                                        }}
                                      >
                                        <Typography
                                          className="property-name"
                                          sx={{
                                            fontWeight: 900,
                                            fontSize: '1rem',
                                            color: pitchBlackTheme.text,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            mb: 1,
                                            transition: 'color 0.3s ease',
                                            position: 'relative',
                                            zIndex: 1,
                                            wordBreak: 'break-word',
                                            lineHeight: 1.2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                          }}
                                        >
                                          {property.displayName}
                                        </Typography>
                                        <Typography
                                          className="property-location"
                                          sx={{
                                            fontSize: '0.875rem',
                                            color: pitchBlackTheme.textSecondary,
                                            fontWeight: 500,
                                            transition: 'color 0.3s ease',
                                            position: 'relative',
                                            zIndex: 1,
                                            wordBreak: 'break-word',
                                            lineHeight: 1.3,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                          }}
                                        >
                                          {formatLocation(property)}
                                        </Typography>
                                      </Box>
                                    </motion.div>
                                  ))
                                )}
                              </Box>
                            </Box>
                            
                            <Box sx={{ textAlign: 'center', px: 4, pt: 0, pb: 4 }}>
                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: isLoading ? 1.2 : 0.8, duration: 0.4 }}
                              >
                                <Button
                                  onClick={handleViewAllProperties}
                                  sx={{
                                    backgroundColor: pitchBlackTheme.primary,
                                    color: pitchBlackTheme.text,
                                    border: `2px solid ${pitchBlackTheme.text}`,
                                    px: 6,
                                    py: 2,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    borderRadius: 0,
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                      backgroundColor: pitchBlackTheme.primaryHover,
                                      borderColor: pitchBlackTheme.primaryHover,
                                      color: pitchBlackTheme.primary,
                                      transform: 'translateY(-2px)',
                                      boxShadow: `0 8px 16px ${pitchBlackTheme.selectedBg}`,
                                    },
                                  }}
                                >
                                  View All Properties
                                </Button>
                              </motion.div>
                            </Box>
                          </Paper>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                  
                  {navigationItems.slice(1).map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <Button
                        href={item.href}
                        sx={{
                          color: pitchBlackTheme.textSecondary,
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          px: 3,
                          py: 2,
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            color: pitchBlackTheme.text,
                            backgroundColor: 'transparent',
                            transform: 'translateY(-2px)',
                            '&::after': {
                              width: '100%',
                              opacity: 1,
                            },
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: '2px',
                            backgroundColor: pitchBlackTheme.text,
                            transition: 'all 0.3s ease',
                            opacity: 0,
                          },
                        }}
                      >
                        {item.name}
                      </Button>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Button
                      endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                      href="/reservations"
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
                        whiteSpace: 'nowrap',
                        minWidth: '160px',
                        fontFamily: '"Arial Black", "Helvetica", sans-serif',
                        transition: 'all 0.2s ease',
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
                    >
                      INQUIRE NOW
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="top"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <AnimatePresence>
          {mobileDrawerOpen && drawerContent}
        </AnimatePresence>
      </Drawer>
    </>
  );
};

export default Header;