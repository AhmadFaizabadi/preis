namespace InvoiceServer.Services.Contracts
{
  public interface IInvoiceServices
  {
    Task EnsureTablesExistAsync();
    Task<(int, string, string)> GetBaseDataAsync(int version);
    Task SaveBaseDataAsync(int version, string supplies, string prices);
  }
}
