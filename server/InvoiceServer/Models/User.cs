using Dapper;


namespace InvoiceServer.Models
{
  [Table("Users")]
  public class User
  {
    [System.ComponentModel.DataAnnotations.Key]
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? UserName { get; set; }
    public string? Title { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Role { get; set; }
    public int PasswordHash { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool Enabled { get; set; }
    public DateTime? CreatedDateTime { get; set; }
    public DateTime? ModifiedDateTime { get; set; }
  }
}
