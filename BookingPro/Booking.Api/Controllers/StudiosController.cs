using Booking.Domain.Entities;
using Booking.Persistance.Contexts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudiosController : ControllerBase
{
    private readonly BookingDbContext _dbContext;

    public StudiosController(BookingDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Studio>>> GetAllStudios() =>
        await _dbContext.Studios.ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Studio>> GetStudio(int id)
    {
        var studio = await _dbContext.Studios.FirstOrDefaultAsync(s => s.Id == id);
        
        return studio == null ? NotFound() : Ok(studio);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Studio>>> SearchByArea(string area) =>
        await _dbContext.Studios.Where(s => s.Location.Area.Contains(area)).ToListAsync();

    [HttpGet("nearby")]
    public async Task<ActionResult<IEnumerable<Studio>>> GetNearby(double lat, double lng, double radius)
    {
        // Calculate squared radius in degrees (~111km per degree)
        double radiusInDegrees = radius / 111.0;
        double radiusSquared = radiusInDegrees * radiusInDegrees;

        return await _dbContext.Studios.Where(s =>
            ((s.Location.Coordinates.Latitude - lat) * (s.Location.Coordinates.Latitude - lat) +
             (s.Location.Coordinates.Longitude - lng) * (s.Location.Coordinates.Longitude - lng))
            <= radiusSquared
        ).ToListAsync();
    }

    [HttpGet("{id}/availability")]
    public async Task<ActionResult<IEnumerable<string>>> GetAvailability(int id, DateTime date)
    {
        var studio = await _dbContext.Studios.FindAsync(id);
        if (studio == null) return NotFound();

        var bookings = await _dbContext.Bookings.Where(b => b.StudioId == id && b.Date == date).Select(b => b.TimeSlot).ToListAsync();

        var open = studio.Availability.Open;
        var close = studio.Availability.Close;

        var slots = new List<string>();
        for (var t = open; t < close; t += TimeSpan.FromHours(1))
        {
            var slot = $"{t:hh\\:mm}-{t + TimeSpan.FromHours(1):hh\\:mm}";
            if (!bookings.Contains(slot)) slots.Add(slot);
        }

        return Ok(slots);
    }
}
