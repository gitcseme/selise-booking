import { useEffect, useState } from "react";
import axios from "../api/axios-config";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  
  const fetchBookings = async () => {
    try {
      const response = await axios.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h1>Booking List</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#26047cff' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Studio Name</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Type</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Location</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Time</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>User Info</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {booking.studio.name}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {booking.studio.type}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {booking.studio.location.area}, {booking.studio.location.city}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {formatDate(booking.date)}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                {booking.timeSlot}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                <div>
                  <strong>{booking.userName}</strong>
                  <br />
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {booking.email}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No bookings found
        </div>
      )}
    </div>
  );
}
