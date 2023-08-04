using InvoiceServer.DTO;
using InvoiceServer.Services;

using Microsoft.AspNetCore.Mvc;

namespace InvoiceServer.Controllers
{
  [ApiController]
  [Route("api/v1/[controller]")]
  public class InvoiceController : ControllerBase
  {
    private readonly InvoiceServices _invoiceServices;

    public InvoiceController()
    {
        _invoiceServices = new InvoiceServices("Data Source=invoice.db");
    }

    [HttpGet("base-data/{version}")]
    public async Task<IActionResult> GetBaseData(int version)
    {
      var data = await _invoiceServices.GetBaseDataAsync(version);
      return Ok(new { version = data.Item1, supplies = data.Item2, prices = data.Item3 });
    }

    [HttpPost("save-base-data")]
    public async Task<IActionResult> SaveBaseData([FromBody] BaseDataDTO data)
    {
      await _invoiceServices.SaveBaseDataAsync(data.version, data.supplies, data.prices);
      return Ok();
    }
  }
}
