using Booking.Persistance.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Booking.Persistance;

public static class PersistanceDIResolver
{
    public static IServiceCollection AddPersistance(this IServiceCollection services, IConfigurationManager configManager)
    {
        services.AddDbContext<BookingDbContext>(options =>
        {
            options.UseSqlServer(configManager.GetConnectionString("BookingDbConnection"), builder =>
            {
                builder.CommandTimeout(30);
                builder.EnableRetryOnFailure(3);
            })
                .EnableDetailedErrors(true)
                .EnableSensitiveDataLogging(true);
        });

        return services;
    }
}
