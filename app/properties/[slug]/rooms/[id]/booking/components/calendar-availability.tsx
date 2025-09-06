'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { 
  Box, 
  Typography, 
  Tooltip, 
  Alert
} from '@mui/material';
import { format, startOfMonth, addMonths, isSameDay, startOfDay } from 'date-fns';
import axios from 'axios';
import { AvailabilityCalendarProps, DailyAvailability, MonthlyAvailability } from '@/types/room-availability-types';

const pitchBlackTheme = {
  background: '#000000',
  surface: '#000000',
  surfaceHover: '#111111',
  primary: '#000000',
  primaryHover: '#ffffff',
  text: '#ffffff',
  textSecondary: '#6b7280',
  border: '#1a1a1a',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  gold: '#FFFFFF',
  goldHover: '#FFFFFF',
};

export function AvailabilityCalendar({
  businessUnitId,
  roomTypeId,
  selectedDate,
  onDateChange,
  label,
  minDate = new Date(),
  maxDate,
  error = false,
  helperText,
  disabled = false,
}: AvailabilityCalendarProps) {
  const [availabilityData, setAvailabilityData] = useState<MonthlyAvailability>({});
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMonthlyAvailability = useCallback(async (month: Date) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const today = startOfDay(new Date());
      const firstDayOfThisMonth = startOfMonth(today);
      const firstDayOfCurrentMonth = startOfMonth(month);
      
      const requestStartDate = firstDayOfCurrentMonth.getTime() === firstDayOfThisMonth.getTime()
        ? today 
        : firstDayOfCurrentMonth;

      const monthEnd = startOfMonth(addMonths(month, 1));
      
      const params = new URLSearchParams({
        businessUnitId,
        roomTypeId,
        checkInDate: requestStartDate.toISOString(),
        checkOutDate: monthEnd.toISOString(),
      });

      const response = await axios.get(`/api/rooms/availability?${params}`);
      if (response.data.dailyAvailability) {
        const monthData: MonthlyAvailability = {};
        
        response.data.dailyAvailability.forEach((day: DailyAvailability) => {
          const dateKey = day.date;
          monthData[dateKey] = {
            availableRooms: day.availableRooms,
            totalRooms: day.totalRooms,
          };
        });
        
        setAvailabilityData(prev => {
          const newData = { ...prev, ...monthData };
          return newData;
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error || 'Failed to load availability data');
      } else {
        setErrorMessage('Failed to load availability data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [businessUnitId, roomTypeId]);

  useEffect(() => {
    fetchMonthlyAvailability(currentMonth);
  }, [fetchMonthlyAvailability, currentMonth]);

  const handleMonthChange = useCallback((newMonth: Date) => {
    const today = new Date();
    const firstDayOfToday = startOfMonth(today);

    if (startOfMonth(newMonth) >= firstDayOfToday) {
      setCurrentMonth(newMonth);
      const nextMonth = addMonths(newMonth, 1);
      fetchMonthlyAvailability(nextMonth);
    }
  }, [fetchMonthlyAvailability]);

  // Handle input focus to select all text
  const handleInputFocus = useCallback((event: React.FocusEvent<HTMLElement>) => {
    // Small delay to ensure the input is properly focused
    setTimeout(() => {
      const target = event.target as HTMLInputElement;
      if (target && typeof target.select === 'function') {
        target.select();
      } else if (target && target.setSelectionRange) {
        // Alternative method for selecting all text
        target.setSelectionRange(0, target.value?.length || 0);
      }
    }, 0);
  }, []);

  // Create a custom day component that looks normal but has availability in tooltip
  const CustomDay = useCallback((props: PickersDayProps) => {
    const { day, outsideCurrentMonth, ...other } = props;
    
    const dateString = format(day, 'yyyy-MM-dd');
    const dayAvailability = availabilityData[dateString];
    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
    
    const isAvailable = dayAvailability && dayAvailability.availableRooms > 0;
    const isUnavailable = dayAvailability && dayAvailability.availableRooms === 0;
    const today = startOfDay(new Date()); 
    const isPastDate = day < today;

    // Create tooltip content with availability information
    const getTooltipContent = () => {
      if (isPastDate) return 'Past date';
      
      if (dayAvailability) {
        return (
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {format(day, 'MMM dd, yyyy')}
            </Typography>
            <Typography variant="body2">
              {dayAvailability.availableRooms} of {dayAvailability.totalRooms} rooms available
            </Typography>
            {isUnavailable && (
              <Typography variant="caption" sx={{ color: pitchBlackTheme.error }}>
                Fully booked
              </Typography>
            )}
            {isAvailable && (
              <Typography variant="caption" sx={{ color: pitchBlackTheme.success }}>
                Available for booking
              </Typography>
            )}
          </Box>
        );
      }
    };

    return (
      <Tooltip
        title={getTooltipContent()}
        arrow
        placement="top"
      >
        <Box>
          <PickersDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            // Only disable past dates and fully booked dates
            disabled={isPastDate || isUnavailable || outsideCurrentMonth}
            sx={{
              // Normal calendar styling - let MUI handle the default appearance
              // Only override what's necessary for the dark theme
              color: isSelected 
                ? '#000000' // Black text for selected date to be visible on white/gold background
                : pitchBlackTheme.text,
              backgroundColor: isSelected 
                ? pitchBlackTheme.gold 
                : 'transparent',
              '&:hover': {
                backgroundColor: isSelected 
                  ? pitchBlackTheme.goldHover 
                  : pitchBlackTheme.surfaceHover,
                color: isSelected 
                  ? '#000000' // Keep black text on hover for selected date
                  : pitchBlackTheme.text,
              },
              '&.Mui-disabled': {
                color: pitchBlackTheme.textSecondary,
                backgroundColor: 'transparent',
              },
            }}
          />
        </Box>
      </Tooltip>
    );
  }, [availabilityData, selectedDate]);

  const calendarSx = useMemo(() => ({
    '& .MuiPickersLayout-root': {
      backgroundColor: pitchBlackTheme.surface,
    },
    '& .MuiDateCalendar-root': {
      backgroundColor: pitchBlackTheme.surface,
      color: pitchBlackTheme.text,
    },
    '& .MuiPickersCalendarHeader-root': {
      backgroundColor: pitchBlackTheme.surface,
      borderBottom: `1px solid ${pitchBlackTheme.border}`,
    },
    '& .MuiPickersCalendarHeader-label': {
      color: pitchBlackTheme.gold,
      fontWeight: 600,
    },
    '& .MuiPickersArrowSwitcher-button': {
      color: pitchBlackTheme.text,
      '&:hover': {
        backgroundColor: pitchBlackTheme.surfaceHover,
      },
      '&.Mui-disabled': { 
        color: pitchBlackTheme.textSecondary,
      }
    },
    '& .MuiDayCalendar-weekDayLabel': {
      color: pitchBlackTheme.textSecondary,
      fontWeight: 600,
    },
    '& .MuiPickersDay-root': {
      color: pitchBlackTheme.text,
      '&:hover': {
        backgroundColor: pitchBlackTheme.surfaceHover,
      },
    },
    '& .MuiPickersYear-yearButton': {
      color: pitchBlackTheme.text,
      '&:hover': {
        backgroundColor: pitchBlackTheme.surfaceHover,
      },
      '&.Mui-selected': {
        backgroundColor: pitchBlackTheme.gold,
        color: pitchBlackTheme.background,
      },
    },
    '& .MuiPickersMonth-monthButton': {
      color: pitchBlackTheme.text,
      '&:hover': {
        backgroundColor: pitchBlackTheme.surfaceHover,
      },
      '&.Mui-selected': {
        backgroundColor: pitchBlackTheme.gold,
        color: pitchBlackTheme.background,
      },
    },
    '& .MuiPaper-root': {
      backgroundColor: pitchBlackTheme.surface,
      border: `1px solid ${pitchBlackTheme.border}`,
    },
  }), []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <DatePicker
          label={label}
          value={selectedDate}
          onChange={onDateChange}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          onMonthChange={handleMonthChange}
          slots={{
            day: CustomDay,
          }}
          slotProps={{
            textField: {
              onFocus: handleInputFocus,
              InputProps: {
                style: {
                  color: '#ffffff',
                  backgroundColor: pitchBlackTheme.surface,
                },
              },
              inputProps: {
                style: {
                  color: '#ffffff !important',
                  WebkitTextFillColor: '#ffffff !important',
                },
              },
              InputLabelProps: {
                style: {
                  color: pitchBlackTheme.textSecondary,
                },
              },
              sx: {
                '& input': {
                  color: '#ffffff !important',
                  WebkitTextFillColor: '#ffffff !important',
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff !important',
                  WebkitTextFillColor: '#ffffff !important',
                },
                '& .MuiInputLabel-root': {
                  color: `${pitchBlackTheme.textSecondary} !important`,
                  '&.Mui-focused': {
                    color: `${pitchBlackTheme.gold} !important`,
                  },
                  '&.MuiInputLabel-shrink': {
                    color: `${pitchBlackTheme.gold} !important`,
                  }
                },
                '& .MuiInputAdornment-root': {
                  color: `${pitchBlackTheme.textSecondary} !important`,
                },
                '& .MuiSvgIcon-root': {
                  color: `${pitchBlackTheme.textSecondary} !important`,
                },
              }
            },
            popper: {
              sx: calendarSx,
            },
            desktopPaper: {
              sx: calendarSx,
            },
            mobilePaper: {
              sx: calendarSx,
            },
            layout: {
              sx: calendarSx,
            },
          }}
          sx={{
            width: '100%',
            // Most specific selectors for the input text color
            '& input': {
              color: '#ffffff !important',
              '-webkit-text-fill-color': '#ffffff !important',
              '&::placeholder': {
                color: '#6b7280 !important',
                opacity: 1,
              },
            },
            '& .MuiInputBase-input': {
              color: '#ffffff !important',
              '-webkit-text-fill-color': '#ffffff !important',
              fontSize: '1.1rem',
            },
            '& .MuiOutlinedInput-input': {
              color: '#ffffff !important',
              '-webkit-text-fill-color': '#ffffff !important',
            },
            '& .MuiInputBase-root': {
              backgroundColor: pitchBlackTheme.surface,
              color: '#ffffff !important',
              '& input': {
                color: '#ffffff !important',
                '-webkit-text-fill-color': '#ffffff !important',
              },
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: pitchBlackTheme.surface,
              color: '#ffffff !important',
              '& fieldset': { borderColor: error ? pitchBlackTheme.error : pitchBlackTheme.border },
              '&:hover fieldset': { borderColor: pitchBlackTheme.gold },
              '&.Mui-focused fieldset': { borderColor: pitchBlackTheme.gold },
              height: '56px',
              '& input': {
                color: '#ffffff !important',
                '-webkit-text-fill-color': '#ffffff !important',
              },
            },
            '& .MuiInputLabel-root': { 
              color: pitchBlackTheme.textSecondary,
              '&.Mui-focused': {
                color: pitchBlackTheme.gold,
              },
              '&.MuiInputLabel-shrink': {
                color: pitchBlackTheme.gold,
              }
            },
            '& .MuiSvgIcon-root': { color: pitchBlackTheme.textSecondary },
            // Additional fallback selectors
            '& input[type="text"]': {
              color: '#ffffff !important',
              '-webkit-text-fill-color': '#ffffff !important',
            },
            // Target any nested input elements
            '& .MuiInputBase-root input': {
              color: '#ffffff !important',
              '-webkit-text-fill-color': '#ffffff !important',
            },
          }}
        />
        
        {helperText && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: error ? pitchBlackTheme.error : pitchBlackTheme.textSecondary,
              mt: 1,
              display: 'block',
              fontSize: '0.75rem',
            }}
          >
            {helperText}
          </Typography>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
            {errorMessage}
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
}