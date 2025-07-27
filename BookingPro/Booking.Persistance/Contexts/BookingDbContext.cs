using Booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Booking.Persistance.Contexts;

public class BookingDbContext : DbContext
{
    public BookingDbContext(DbContextOptions options) : base(options) { }

    public DbSet<Studio> Studios { get; set; }
    public DbSet<Domain.Entities.Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Studio>(s =>
        {
            s.OwnsOne(st => st.Location, l =>
            {
                l.OwnsOne(c => c.Coordinates);
            });

            s.OwnsOne(st => st.Contact);
            s.OwnsOne(st => st.Availability);

        });

        modelBuilder.Entity<Domain.Entities.Booking>()
            .HasOne(b => b.Studio)
            .WithMany(s => s.Bookings)
            .HasForeignKey(b => b.StudioId);
    }
}
