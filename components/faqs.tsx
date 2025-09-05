'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import { ExpandMore, ArrowForward } from '@mui/icons-material';
import { faqs } from '@/data/faqs';

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

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  
  const filteredFaqs = selectedCategory 
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs;

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
            Frequently
            <br />
            Asked Questions
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
            Find answers to common questions about our properties, services, 
            and booking policies. Get the information you need instantly.
          </Typography>
        </Box>
      </Container>

      <Container maxWidth="xl">
        {/* Category Filters */}
        <Box sx={{ mb: { xs: 6, md: 10 }, display: 'flex', justifyContent: 'center' }}>
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              flexWrap: 'wrap', 
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Chip
              label="All Categories"
              onClick={() => setSelectedCategory(null)}
              sx={{
                backgroundColor: selectedCategory === null ? pitchBlackTheme.selected : pitchBlackTheme.surface,
                color: selectedCategory === null ? pitchBlackTheme.primary : pitchBlackTheme.text,
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: 0,
                height: 40,
                px: 3,
                border: `2px solid ${selectedCategory === null ? pitchBlackTheme.selected : pitchBlackTheme.border}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                '&:hover': {
                  backgroundColor: pitchBlackTheme.primaryHover,
                  color: pitchBlackTheme.primary,
                  borderColor: pitchBlackTheme.primaryHover,
                  transform: 'translateY(-2px)',
                },
              }}
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  backgroundColor: selectedCategory === category ? pitchBlackTheme.selected : pitchBlackTheme.surface,
                  color: selectedCategory === category ? pitchBlackTheme.primary : pitchBlackTheme.text,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderRadius: 0,
                  height: 40,
                  px: 3,
                  border: `2px solid ${selectedCategory === category ? pitchBlackTheme.selected : pitchBlackTheme.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  '&:hover': {
                    backgroundColor: pitchBlackTheme.primaryHover,
                    color: pitchBlackTheme.primary,
                    borderColor: pitchBlackTheme.primaryHover,
                    transform: 'translateY(-2px)',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* FAQ Accordions */}
        <Box sx={{ maxWidth: '900px', mx: 'auto', mb: { xs: 8, md: 12 } }}>
          {filteredFaqs.map((faq, index) => (
            <Box
              key={faq.id}
              sx={{
                mb: 3,
                backgroundColor: pitchBlackTheme.surface,
                borderRadius: 0,
                overflow: 'hidden',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                border: `1px solid ${pitchBlackTheme.border}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 28px ${pitchBlackTheme.selectedBg}`,
                  borderColor: pitchBlackTheme.text,
                },
              }}
            >
              <Accordion
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                sx={{
                  boxShadow: 'none',
                  border: 'none',
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMore 
                      sx={{ 
                        color: pitchBlackTheme.textSecondary,
                        fontSize: 28,
                        transition: 'transform 0.3s ease, color 0.3s ease',
                      }} 
                    />
                  }
                  sx={{
                    backgroundColor: expanded === faq.id ? pitchBlackTheme.surfaceHover : pitchBlackTheme.surface,
                    minHeight: 80,
                    px: { xs: 3, md: 4 },
                    py: 2,
                    transition: 'all 0.3s ease',
                    '& .MuiAccordionSummary-content': {
                      margin: '16px 0',
                      alignItems: 'center',
                    },
                    '&:hover': {
                      backgroundColor: pitchBlackTheme.surfaceHover,
                      '& .MuiSvgIcon-root': {
                        color: pitchBlackTheme.text,
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 3 }}>
                    {/* Question Number */}
                    <Box
                      sx={{
                        backgroundColor: expanded === faq.id ? pitchBlackTheme.selected : pitchBlackTheme.surfaceHover,
                        color: expanded === faq.id ? pitchBlackTheme.primary : pitchBlackTheme.text,
                        width: 40,
                        height: 40,
                        borderRadius: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                        border: `1px solid ${expanded === faq.id ? pitchBlackTheme.selected : pitchBlackTheme.border}`,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Box>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1.1rem', md: '1.25rem' },
                          color: pitchBlackTheme.text,
                          lineHeight: 1.4,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </Box>

                    <Chip
                      label={faq.category}
                      sx={{
                        backgroundColor: expanded === faq.id ? pitchBlackTheme.selected : pitchBlackTheme.surfaceHover,
                        color: expanded === faq.id ? pitchBlackTheme.primary : pitchBlackTheme.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderRadius: 0,
                        height: 28,
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                        border: `1px solid ${expanded === faq.id ? pitchBlackTheme.selected : pitchBlackTheme.border}`,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: 4,
                    pt: 0,
                    backgroundColor: pitchBlackTheme.surfaceHover,
                    borderTop: `1px solid ${pitchBlackTheme.border}`,
                  }}
                >
                  <Box sx={{ pl: { xs: 0, md: 7 } }}>
                    <Typography
                      sx={{
                        color: pitchBlackTheme.textSecondary,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.7,
                        fontWeight: 400,
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          ))}
        </Box>

        {/* Bottom CTA Section */}
        <Box 
          sx={{ 
            textAlign: 'center',
            backgroundColor: pitchBlackTheme.surface,
            border: `1px solid ${pitchBlackTheme.border}`,
            py: { xs: 8, md: 12 },
            px: { xs: 4, md: 6 },
            maxWidth: '800px',
            mx: 'auto',
            mt: { xs: 8, md: 12 },
            mb: { xs: 8, md: 12 },
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: pitchBlackTheme.text,
              boxShadow: `0 8px 24px ${pitchBlackTheme.selectedBg}`,
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              color: pitchBlackTheme.text,
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: 0.9,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Still have
            <br />
            questions?
          </Typography>
          
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              lineHeight: 1.6,
              mb: 6,
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            Our dedicated support team is here to help you with any additional 
            questions or concerns you may have.
          </Typography>
          
          <Button
            endIcon={<ArrowForward sx={{ fontSize: 16, transition: 'color 0.3s ease' }} />}
            sx={{
              backgroundColor: pitchBlackTheme.primary,
              color: pitchBlackTheme.text,
              border: `2px solid ${pitchBlackTheme.text}`,
              px: 8,
              py: 3,
              fontSize: '0.8rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              borderRadius: 0,
              fontFamily: '"Arial Black", "Helvetica", sans-serif',
              transition: 'all 0.2s ease',
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
            Contact Support
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;