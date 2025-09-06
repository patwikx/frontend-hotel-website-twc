// app/api/rooms/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

const availabilitySchema = z.object({
  businessUnitId: z.string().uuid('Invalid business unit ID'),
  roomTypeId: z.string().uuid('Invalid room type ID'),
  checkInDate: z.string().datetime('Invalid check-in date format'),
  checkOutDate: z.string().datetime('Invalid check-out date format'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const queryData = {
      businessUnitId: searchParams.get('businessUnitId'),
      roomTypeId: searchParams.get('roomTypeId'),
      checkInDate: searchParams.get('checkInDate'),
      checkOutDate: searchParams.get('checkOutDate'),
    };

    const validatedData = availabilitySchema.parse(queryData);
    
    const { businessUnitId, roomTypeId, checkInDate, checkOutDate } = validatedData;
    
    // Parse dates
 const checkIn = new Date(checkInDate);
const checkOut = new Date(checkOutDate);

// Validate date logic
if (checkIn >= checkOut) {
  return NextResponse.json(
    { error: 'Check-out date must be after check-in date' },
    { status: 400 }
  );
}

// Check if dates are in the past using UTC for consistency
const today = new Date();
// Create a new date for the beginning of the current day in UTC
const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

if (checkIn < todayUTC) {
  return NextResponse.json(
    { error: 'Check-in date cannot be in the past' },
    { status: 400 }
  );
}

    // Verify business unit and room type exist and are active
    const businessUnit = await prisma.businessUnit.findFirst({
      where: {
        id: businessUnitId,
        isActive: true,
      },
    });

    if (!businessUnit) {
      return NextResponse.json(
        { error: 'Business unit not found or inactive' },
        { status: 404 }
      );
    }

    const roomType = await prisma.roomType_Model.findFirst({
      where: {
        id: roomTypeId,
        businessUnitId: businessUnitId,
        isActive: true,
      },
    });

    if (!roomType) {
      return NextResponse.json(
        { error: 'Room type not found or inactive' },
        { status: 404 }
      );
    }

    // Get total count of rooms of this type
    const totalRoomsOfType = await prisma.room.count({
      where: {
        businessUnitId: businessUnitId,
        roomTypeId: roomTypeId,
        isActive: true,
        status: {
          in: ['AVAILABLE', 'OCCUPIED', 'CLEANING'],
        },
      },
    });

    if (totalRoomsOfType === 0) {
      return NextResponse.json({
        isAvailable: false,
        availableRooms: 0,
        totalRooms: 0,
        message: 'No rooms of this type are currently available for booking',
      });
    }

    // Get all overlapping reservations in the date range with a single query
    const allOverlappingReservations = await prisma.reservationRoom.findMany({
      where: {
        roomTypeId: roomTypeId,
        reservation: {
          businessUnitId: businessUnitId,
          status: {
            in: ['CONFIRMED', 'CHECKED_IN', 'PROVISIONAL'],
          },
          OR: [
            {
              // Reservations that start within the requested range
              checkInDate: {
                gte: checkIn,
                lt: checkOut,
              },
            },
            {
              // Reservations that end within the requested range
              checkOutDate: {
                gt: checkIn,
                lte: checkOut,
              },
            },
            {
              // Reservations that span the entire requested range
              checkInDate: {
                lt: checkIn,
              },
              checkOutDate: {
                gt: checkOut,
              },
            },
          ],
        },
      },
      select: {
        reservation: {
          select: {
            checkInDate: true,
            checkOutDate: true,
          },
        },
      },
    });
    
    // Create a map to store daily booking counts
    const dailyBookingCounts: { [key: string]: number } = {};
    const currentDate = new Date(checkIn);

    // Loop through each day in the requested range
    while (currentDate < checkOut) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      let bookingsForDay = 0;
      
      // Calculate bookings for the current day from the fetched reservations
      allOverlappingReservations.forEach(reservationRoom => {
        const res = reservationRoom.reservation;
        const resCheckIn = new Date(res.checkInDate);
        const resCheckOut = new Date(res.checkOutDate);

        // A room is booked on a given date if the reservation's check-in is on or before that date
        // AND its check-out is after that date.
        if (resCheckIn.getTime() <= currentDate.getTime() && resCheckOut.getTime() > currentDate.getTime()) {
          bookingsForDay++;
        }
      });

      dailyBookingCounts[dateString] = bookingsForDay;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Format the daily availability for the frontend
    const dailyAvailability = Object.keys(dailyBookingCounts).map(date => {
      const bookedRooms = dailyBookingCounts[date];
      return {
        date,
        availableRooms: Math.max(0, totalRoomsOfType - bookedRooms),
        totalRooms: totalRoomsOfType,
      };
    });

    const minAvailableRooms = Math.min(...dailyAvailability.map(d => d.availableRooms));

    return NextResponse.json({
      isAvailable: minAvailableRooms > 0,
      availableRooms: minAvailableRooms,
      totalRooms: totalRoomsOfType,
      requestedDates: {
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        nights: Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
      },
      dailyAvailability,
      message: minAvailableRooms > 0 
        ? `${minAvailableRooms} room${minAvailableRooms > 1 ? 's' : ''} available for your selected dates`
        : 'No rooms available for the selected dates',
    });

  } catch (error) {
    console.error('Room availability check error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request parameters',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}