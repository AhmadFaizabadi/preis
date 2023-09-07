
using InvoiceServer.Services;
using InvoiceServer.Services.Contracts;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;


using AutoMapper;
using System.Text;
using System.Reflection;

namespace InvoiceServer.Extensions
{
  public static class ServiceExtensions
  {
    public static void ConfigureServices(this IServiceCollection services)
    {
      services.AddScoped<IInvoiceServices, InvoiceServices>();
      services.AddScoped<IUserServices,UserServices>();
    }
    public static void ConfigureMapper(this IServiceCollection services)
    {
      services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }
    public static void ConfigureJWT(this IServiceCollection services, IConfiguration configuration)
    {
      var jwtSettings = configuration.GetSection("Jwt");
      var secretKey = Environment.GetEnvironmentVariable("SECRET");
      services.AddAuthentication(opt =>
      {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
      .AddJwtBearer(options =>
      {
        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateLifetime = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer = jwtSettings["Issuer"],
          ValidAudience = jwtSettings["Issuer"],
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
        
      });
    }

    public static void ConfigureAuthorization(this IServiceCollection services)
    {
      services.AddAuthorization(options =>
      {
        options.AddPolicy("RequireManager",
                  policy => policy.RequireRole("Administrator", "Manager"));
        options.AddPolicy("RequirePriceTaker",
                  policy => policy.RequireRole("Administrator", "Manager", "PriceTaker", "PriceTaker2"));
      });
    }

  }
}
