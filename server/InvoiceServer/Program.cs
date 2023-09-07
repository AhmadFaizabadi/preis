using InvoiceServer.Services;
using InvoiceServer.Extensions;
using InvoiceServer.Services.Contracts;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.ConfigureAuthorization();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigureServices();
builder.Services.ConfigureMapper();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
using var scope = app.Services.CreateScope();
var invoiceService=scope.ServiceProvider.GetRequiredService<IInvoiceServices>();
await invoiceService.EnsureTablesExistAsync();
app.Run();
