using AutoMapper;

using Dapper;

using InvoiceServer.DTO;
using InvoiceServer.Models;
using InvoiceServer.Services.Contracts;

using Microsoft.Data.Sqlite;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

using static InvoiceServer.Services.InvoiceServices;

namespace InvoiceServer.Services
{
  
  public class UserServices : IUserServices
  {
    private readonly string _cns;
    private readonly JWTrec _jwt;
    private readonly IMapper _mapper;

    internal record JWTrec(string issuer, string audience, string key);

    public UserServices(IConfiguration configuration, IMapper mapper)
    {
      _cns = configuration.GetConnectionString("InvoiceDB") ?? "Data Source=invoice.db";
      _jwt = new JWTrec(configuration["Jwt:Issuer"] ?? "", configuration["Jwt:Audience"] ?? "",
              Environment.GetEnvironmentVariable("SECRET") ?? "");
      _mapper = mapper;
    }
    public async Task<IEnumerable<User>> GetUsersAsync()
    {
      using (var connection = new SqliteConnection(_cns))
      {
        connection.Open();
        var users = await connection.GetListAsync<User>();
        return users;
      }
    }

    public string CreateToken(User user)
    {
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[]
          {
                new Claim("Id", Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString())
             }),
        Expires = DateTime.UtcNow.AddMinutes(5),
        Issuer = _jwt.issuer,
        Audience = _jwt.audience,
        SigningCredentials = new SigningCredentials
          (new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.key)),
          SecurityAlgorithms.HmacSha512Signature)
      };
      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDescriptor);
      var stringToken = tokenHandler.WriteToken(token);
      return stringToken;
    }

    public static string GenerateSHA256Hash(string input, string salt)
    {
      using (SHA256 sha256 = SHA256.Create())
      {
        byte[] saltBytes = Encoding.UTF8.GetBytes(salt);
        byte[] inputBytes = Encoding.UTF8.GetBytes(input);

        byte[] combinedBytes = new byte[saltBytes.Length + inputBytes.Length];
        Buffer.BlockCopy(saltBytes, 0, combinedBytes, 0, saltBytes.Length);
        Buffer.BlockCopy(inputBytes, 0, combinedBytes, saltBytes.Length, inputBytes.Length);

        byte[] hashBytes = sha256.ComputeHash(combinedBytes);

        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < hashBytes.Length; i++)
        {
          builder.Append(hashBytes[i].ToString("x2"));
        }

        return builder.ToString();
      }
    }
    public async Task<int?> AddNewUserAsync(UserNewDTO user)
    {
      using (var connection = new SqliteConnection(_cns))
      {
        await connection.OpenAsync();
        var id = await connection.InsertAsync(_mapper.Map<User>(user));
        return id;
      }
    }
    public async Task UpdateUserAsync(User user)
    {
      using (var connection = new SqliteConnection(_cns))
      {
        await connection.OpenAsync();
        await connection.UpdateAsync(user);
      }
    }

  }
}
