using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Booking.Domain.Entities;


public class Studio : EntityBase<int>
{
    public string Name { get; set; }
    public string Type { get; set; }
    public Location Location { get; set; }
    public Contact Contact { get; set; }
    public string Description { get; set; }
    public decimal PricePerHour { get; set; }
    public string Currency { get; set; }
    public Availability Availability { get; set; }
    public float Rating { get; set; }

    public string Amenities { get; set; }
    public string Images { get; set; }

    public ICollection<Booking> Bookings { get; set; }
}

public class Location
{
    public string City { get; set; }
    public string Area { get; set; }
    public string Address { get; set; }
    public Coordinates Coordinates { get; set; }
}

public class Coordinates
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class Contact
{
    public string Phone { get; set; }
    public string Email { get; set; }
}

public class Availability
{
    public TimeSpan Open { get; set; }
    public TimeSpan Close { get; set; }
}

public class StudioAmenity : EntityBase<int>
{
    public string Name { get; set; }
    public int StudioId { get; set; }
}

public class StudioImage : EntityBase<int>
{
    public string Url { get; set; }
    public int StudioId { get; set; }
}
