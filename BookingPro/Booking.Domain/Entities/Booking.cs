namespace Booking.Domain.Entities;

public class Booking : EntityBase<int>
{
    public int StudioId { get; set; }
    public Studio Studio { get; set; }

    public string UserName { get; set; }
    public string Email { get; set; }

    public DateTime Date { get; set; }
    public string TimeSlot { get; set; }
}
