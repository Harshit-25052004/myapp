// Mock backend service with sample booking data
const mockBookings = {
  "68864aa2a3c55c813f55dc51": { // VRB Sparkle
    booked: [
      {
        _id: "booking1",
        client_name: "John Sharma",
        aadhar_number: "123456789012",
        pan_number: "ABCDE1234F",
        plot_number: "A-01",
        status: "booked",
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        _id: "booking2",
        client_name: "Priya Gupta",
        aadhar_number: "987654321098",
        pan_number: "XYZAB5678G",
        plot_number: "A-02",
        status: "booked",
        created_at: "2024-01-16T14:20:00Z"
      }
    ],
    hold: [
      {
        _id: "booking3",
        client_name: "Rahul Singh",
        aadhar_number: "555666777888",
        pan_number: "PQRST9012H",
        plot_number: "B-01",
        status: "hold",
        created_at: "2024-01-17T09:15:00Z"
      }
    ],
    complete: [
      {
        _id: "booking4",
        client_name: "Anjali Verma",
        aadhar_number: "111222333444",
        pan_number: "LMNOP3456I",
        plot_number: "C-01",
        status: "complete",
        created_at: "2024-01-10T16:45:00Z"
      }
    ],
    force: [
      {
        _id: "booking5",
        client_name: "Vikash Kumar",
        aadhar_number: "444555666777",
        pan_number: "FGHIJ7890J",
        plot_number: "D-01",
        status: "force",
        created_at: "2024-01-18T11:30:00Z"
      }
    ]
  },
  "68864aa2a3c55c813f55dc52": { // VRB Sapphire Park
    booked: [
      {
        _id: "booking6",
        client_name: "Arjun Patel",
        aadhar_number: "222333444555",
        pan_number: "MNBVC2468K",
        plot_number: "SP-A1",
        status: "booked",
        created_at: "2024-01-19T13:20:00Z"
      }
    ],
    hold: [
      {
        _id: "booking7",
        client_name: "Kavya Nair",
        aadhar_number: "666777888999",
        pan_number: "QWERT1357L",
        plot_number: "SP-B2",
        status: "hold",
        created_at: "2024-01-20T08:45:00Z"
      }
    ],
    complete: [
      {
        _id: "booking8",
        client_name: "Suresh Reddy",
        aadhar_number: "777888999000",
        pan_number: "ASDFG9876M",
        plot_number: "SP-C3",
        status: "complete",
        created_at: "2024-01-12T12:15:00Z"
      }
    ],
    force: []
  }
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockBackendAPI = {
  // Get property bookings
  async getPropertyBookings(propertyId) {
    await delay(200); // Simulate network delay

    const propertyBookings = mockBookings[propertyId] || {
      booked: [],
      hold: [],
      complete: [],
      force: []
    };

    // Calculate all bookings (combine all statuses except force)
    const allBookings = [
      ...propertyBookings.booked,
      ...propertyBookings.hold,
      ...propertyBookings.complete
    ];

    // Calculate available plots (example: total plots minus booked ones)
    // For demo, we'll create some available plots
    const totalPlotsForProperty = {
      "68864aa2a3c55c813f55dc51": 85, // VRB Sparkle
      "68864aa2a3c55c813f55dc52": 95, // VRB Sapphire Park
      "68864aa2a3c55c813f55dc53": 150, // Elite Word Dreamworld City
    };

    const totalPlots = totalPlotsForProperty[propertyId] || 50;
    const bookedPlotNumbers = allBookings.map(b => b.plot_number);
    const availablePlots = [];

    // Generate available plot numbers (for demo)
    for (let i = 1; i <= Math.min(10, totalPlots - allBookings.length); i++) {
      const plotNumber = `AV-${i.toString().padStart(2, '0')}`;
      if (!bookedPlotNumbers.includes(plotNumber)) {
        availablePlots.push({
          _id: `available_${i}`,
          client_name: "Available",
          plot_number: plotNumber,
          status: "available",
          aadhar_number: "Available",
          pan_number: "Available"
        });
      }
    }

    const organizedBookings = {
      all: allBookings,
      available: availablePlots,
      booked: propertyBookings.booked,
      hold: propertyBookings.hold,
      complete: propertyBookings.complete
    };

    return {
      success: true,
      data: organizedBookings
    };
  },

  // Create booking
  async createBooking(bookingData) {
    await delay(150);
    
    const newBooking = {
      _id: "booking_" + Date.now(),
      ...bookingData,
      status: bookingData.status || "booked",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to mock data
    const propertyId = bookingData.property_id;
    if (!mockBookings[propertyId]) {
      mockBookings[propertyId] = { booked: [], hold: [], complete: [], force: [] };
    }

    const status = newBooking.status;
    // Only add to original status categories (not all or available)
    if (mockBookings[propertyId][status] && status !== 'all' && status !== 'available') {
      mockBookings[propertyId][status].push(newBooking);
    }
    
    return {
      success: true,
      data: newBooking,
      message: "Booking created successfully"
    };
  }
};
