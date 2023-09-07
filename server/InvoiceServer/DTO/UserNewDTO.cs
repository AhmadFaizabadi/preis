namespace InvoiceServer.DTO
{
  public class UserNewDTO
  {
    public required string name { get; set; }
    public required string userName { get; set; }
    public required string role { get; set; }
    public required string email { get; set; }
    public required string password { get; set; }
  }
}
