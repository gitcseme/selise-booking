using Booking.Api.DTO;
using Booking.Persistance.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly BookingDbContext _context;

    public BookingsController(BookingDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Domain.Entities.Booking>>> GetBookings() =>
        await _context.Bookings.Include(b => b.Studio).ToListAsync();

    [HttpPost]
    public async Task<ActionResult> CreateBooking(BookingDTO dto)
    {
        var studio = await _context.Studios.Include(s => s.Availability).FirstOrDefaultAsync(s => s.Id == dto.StudioId);
        if (studio == null) return NotFound("Studio not found.");

        var conflict = await _context.Bookings.AnyAsync(b =>
            b.StudioId == dto.StudioId && b.Date == dto.Date && b.TimeSlot == dto.TimeSlot);

        if (conflict) return Conflict("This time slot is already booked.");

        var booking = new Domain.Entities.Booking
        {
            StudioId = dto.StudioId,
            UserName = dto.UserName,
            Email = dto.Email,
            Date = dto.Date,
            TimeSlot = dto.TimeSlot
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return Ok(booking);
    }
}
