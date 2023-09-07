using InvoiceServer.DTO;
using InvoiceServer.Models;

namespace InvoiceServer.Services.Contracts
{
  public interface IUserServices
  {
    Task<int?> AddNewUserAsync(UserNewDTO user);
    string CreateToken(User user);
    Task<IEnumerable<User>> GetUsersAsync();
    Task UpdateUserAsync(User user);
  }

}
