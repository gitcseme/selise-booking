namespace Booking.Api.DTO;

public class BookingDTO
{
    public int StudioId { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public DateTime Date { get; set; }
    public string TimeSlot { get; set; }
}
