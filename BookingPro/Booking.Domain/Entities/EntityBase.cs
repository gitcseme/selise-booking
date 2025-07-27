namespace Booking.Domain.Entities;

public class EntityBase<TKey> where TKey : IEquatable<TKey>
{
    public TKey Id { get; set; }
}