using InvoiceServer.DTO;
using InvoiceServer.Services;
using InvoiceServer.Services.Contracts;

using Microsoft.AspNetCore.Mvc;

namespace InvoiceServer.Controllers
{
  [ApiController]
  [Route("api/v1/[controller]")]
  public class UserController : Controller
  {
    private readonly IUserServices _userServices;

    public UserController(IUserServices userServices)
    {
      _userServices = userServices;
    }
    [HttpGet("list")]
    public async Task<IActionResult> Index()
    {
      return Ok();
    }
    [HttpPost]
    public async Task<IActionResult> NewUser(UserNewDTO user)
    {
      try
      {
        var newUserId = await _userServices.AddNewUserAsync(user);
        return Ok(newUserId);
      }
      catch (Exception ex)
      {
        return BadRequest(new {errorMessage=ex.Message });
      }
    }
  }
}
