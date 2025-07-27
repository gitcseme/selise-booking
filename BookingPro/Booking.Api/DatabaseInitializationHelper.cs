using Booking.Domain.Entities;
using Booking.Persistance.Contexts;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Booking.Api;

public static class DatabaseInitializationHelper
{
    public static void MigrateDatabase(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BookingDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<BookingDbContext>>();

        try
        {
            logger.LogInformation("Applying migrations to the database...");
            context.Database.Migrate();
            logger.LogInformation("Database migrations applied successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while applying migrations to the database.");
        }

        SeedDatabase(app);
    }

    public static void SeedDatabase(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BookingDbContext>();

        if (!context.Studios.Any())
        {
            var json = File.ReadAllText("seed.json");
            var studiomodels = JsonConvert.DeserializeObject<List<StudioModel>>(json);

            var studios = studiomodels.Select(sm => new Studio
            {
                Name = sm.Name,
                Type = sm.Type,
                Location = new Location
                {
                    City = sm.Location.City,
                    Area = sm.Location.Area,
                    Address = sm.Location.Address,
                    Coordinates = new Coordinates
                    {
                        Latitude = sm.Location.Coordinates.Latitude,
                        Longitude = sm.Location.Coordinates.Longitude
                    }
                },
                Contact = new Contact
                {
                    Phone = sm.Contact.Phone,
                    Email = sm.Contact.Email
                },
                Description = sm.Description,
                PricePerHour = sm.PricePerHour,
                Currency = sm.Currency,
                Availability = new Availability
                {
                    Open = sm.Availability.Open,
                    Close = sm.Availability.Close
                },
                Rating = sm.Rating,
                Amenities = sm.Amenities != null ? string.Join(",", sm.Amenities) : string.Empty,
                Images = sm.Images != null ? string.Join(",", sm.Images) : string.Empty
            });

            context.Studios.AddRange(studios);
            context.SaveChanges();
        }
    }

    
}

public class StudioModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public Location Location { get; set; }
    public Contact Contact { get; set; }
    public string Description { get; set; }
    public decimal PricePerHour { get; set; }
    public string Currency { get; set; }
    public Availability Availability { get; set; }
    public float Rating { get; set; }

    public List<string> Amenities { get; set; }
    public List<string> Images { get; set; }
}