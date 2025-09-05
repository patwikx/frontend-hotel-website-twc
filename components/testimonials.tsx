'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
} from '@mui/material';
import { FormatQuote } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { TestimonialData } from '../lib/actions/testimonials';

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
  warning: '#f59e0b',
  accent: '#3b82f6',
};

interface TestimonialsProps {
  testimonials: TestimonialData[];
}

// Container animation for the entire testimonial card
const cardContainerVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
  }
};

// Avatar section animation
const avatarSectionVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  }
};

// Content section animation with staggered children
const contentSectionVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  }
};

// Individual content item animation
const contentItemVariants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
  }
};

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  if (!testimonials.length) {
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
            No testimonials available at the moment.
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
            What Our
            <br />
            Guests Say
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
            Hear from our satisfied guests about their exceptional experiences
            at Tropicana Worldwide properties.
          </Typography>
        </Box>
      </Container>

      {/* Testimonials List */}
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 6, md: 8 },
            maxWidth: '1200px',
            mx: 'auto',
            mb: { xs: 12, md: 20 },
          }}
        >
          {testimonials.map((testimonial, index) => {
            const isEven = index % 2 === 0;
            const displayRating = testimonial.rating || 5;
            
            return (
              <motion.div
                key={testimonial.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={cardContainerVariants}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                  type: "tween"
                }}
              >
                <Card
                  sx={{
                    backgroundColor: pitchBlackTheme.surface,
                    borderRadius: 0,
                    boxShadow: 'none',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: `1px solid ${pitchBlackTheme.border}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${pitchBlackTheme.selectedBg}`,
                      borderColor: pitchBlackTheme.text,
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
                      minHeight: { xs: 'auto', md: '400px' },
                      width: '100%',
                    }}
                  >
                    {/* Avatar Section */}
                    <motion.div variants={avatarSectionVariants} style={{ flex: '1' }}>
                      <Box 
                        sx={{ 
                          flex: { xs: '1', md: '0 0 40%' },
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: pitchBlackTheme.surfaceHover,
                          py: { xs: 6, md: 0 },
                          height: '100%',
                          borderRight: isEven ? `1px solid ${pitchBlackTheme.border}` : 'none',
                          borderLeft: !isEven ? `1px solid ${pitchBlackTheme.border}` : 'none',
                        }}
                      >
                        <Box
                          sx={{
                            textAlign: 'center',
                            position: 'relative',
                          }}
                        >
                          {/* Quote Icon */}
                          <FormatQuote 
                            sx={{ 
                              position: 'absolute',
                              top: -20,
                              [isEven ? 'right' : 'left']: -20,
                              color: pitchBlackTheme.text,
                              fontSize: 48,
                              opacity: 0.1,
                              transform: isEven ? 'none' : 'scaleX(-1)',
                            }} 
                          />

                          <Avatar
                            src={testimonial.guestImage || undefined}
                            alt={testimonial.guestName}
                            sx={{
                              width: { xs: 120, md: 140 },
                              height: { xs: 120, md: 140 },
                              mx: 'auto',
                              mb: 3,
                              border: `4px solid ${pitchBlackTheme.border}`,
                              boxShadow: `0 8px 24px ${pitchBlackTheme.selectedBg}`,
                              fontSize: '3rem',
                              fontWeight: 700,
                              backgroundColor: pitchBlackTheme.accent,
                              color: 'white',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                borderColor: pitchBlackTheme.text,
                              },
                            }}
                          >
                            {!testimonial.guestImage && 
                              testimonial.guestName.charAt(0).toUpperCase()
                            }
                          </Avatar>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: '1.5rem', md: '1.75rem' },
                              color: pitchBlackTheme.text,
                              mb: 1,
                              letterSpacing: '0.02em',
                              textTransform: 'uppercase',
                              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            }}
                          >
                            {testimonial.guestName}
                          </Typography>

                          {testimonial.guestTitle && (
                            <Typography
                              sx={{
                                color: pitchBlackTheme.textSecondary,
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                mb: 1,
                                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                              }}
                            >
                              {testimonial.guestTitle}
                            </Typography>
                          )}

                          {testimonial.guestCountry && (
                            <Typography
                              sx={{
                                color: pitchBlackTheme.textSecondary,
                                fontWeight: 600,
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                mb: 1,
                                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                              }}
                            >
                              {testimonial.guestCountry}
                            </Typography>
                          )}

                          {testimonial.stayDate && (
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: pitchBlackTheme.textSecondary,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                              }}
                            >
                              Stay: {new Date(testimonial.stayDate).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                              })}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div variants={contentSectionVariants} style={{ flex: '1' }}>
                      <Box 
                        sx={{ 
                          flex: { xs: '1', md: '0 0 60%' },
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                        }}
                      >
                        <CardContent 
                          sx={{ 
                            p: { xs: 4, md: 6 },
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            textAlign: { xs: 'center', md: isEven ? 'left' : 'right' },
                          }}
                        >
                          {/* Rating */}
                          <motion.div variants={contentItemVariants}>
                            <Box 
                              sx={{ 
                                mb: 4,
                                display: 'flex',
                                justifyContent: { 
                                  xs: 'center', 
                                  md: isEven ? 'flex-start' : 'flex-end' 
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Rating 
                                  value={displayRating} 
                                  readOnly 
                                  sx={{ 
                                    color: pitchBlackTheme.warning,
                                    fontSize: '2rem',
                                    mb: 1,
                                    '& .MuiRating-iconEmpty': {
                                      color: pitchBlackTheme.border,
                                    },
                                  }} 
                                />
                                <Typography
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: pitchBlackTheme.text,
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                                  }}
                                >
                                  {displayRating}/5 Stars
                                </Typography>
                              </Box>
                            </Box>
                          </motion.div>

                          {/* Quote */}
                          <motion.div variants={contentItemVariants}>
                            <Typography
                              sx={{
                                color: pitchBlackTheme.textSecondary,
                                fontSize: { xs: '1.25rem', md: '1.5rem' },
                                lineHeight: 1.6,
                                mb: 4,
                                fontWeight: 400,
                                fontStyle: 'italic',
                                maxWidth: '500px',
                                mx: { xs: 'auto', md: isEven ? '0' : 'auto' },
                                ml: { md: isEven ? '0' : 'auto' },
                                position: 'relative',
                                '&::before': {
                                  content: '"\\"',
                                  color: pitchBlackTheme.text,
                                  fontSize: '3rem',
                                  fontWeight: 900,
                                  position: 'absolute',
                                  top: -10,
                                  left: isEven ? -20 : 'auto',
                                  right: isEven ? 'auto' : -20,
                                },
                                '&::after': {
                                  content: '"\\"',
                                  color: pitchBlackTheme.text,
                                  fontSize: '3rem',
                                  fontWeight: 900,
                                  position: 'absolute',
                                  bottom: -20,
                                  right: isEven ? -20 : 'auto',
                                  left: isEven ? 'auto' : -20,
                                }
                              }}
                            >
                              {testimonial.content}
                            </Typography>
                          </motion.div>

                          {/* Source and Date */}
                          <motion.div variants={contentItemVariants}>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: { xs: 'center', md: isEven ? 'flex-start' : 'flex-end' },
                              gap: 1,
                            }}>
                              {testimonial.source && (
                                <Typography
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: pitchBlackTheme.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                                  }}
                                >
                                  Via {testimonial.source}
                                </Typography>
                              )}
                              
                              {testimonial.reviewDate && (
                                <Typography
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    color: pitchBlackTheme.textSecondary,
                                  }}
                                >
                                  {new Date(testimonial.reviewDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </Typography>
                              )}
                            </Box>
                          </motion.div>
                        </CardContent>
                      </Box>
                    </motion.div>
                  </Box>
                </Card>
              </motion.div>
            );
          })}
        </Box>

        {/* Bottom Section */}
        <Box 
          sx={{ 
            textAlign: 'center',
            py: { xs: 6, md: 8 },
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
            Ready to create
            <br />
            your own story?
          </Typography>
          
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              lineHeight: 1.6,
              maxWidth: '500px',
              mx: 'auto',
              fontWeight: 400,
              mb: 6,
            }}
          >
            Join thousands of satisfied guests who have experienced luxury redefined.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;