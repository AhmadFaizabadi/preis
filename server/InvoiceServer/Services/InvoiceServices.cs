using InvoiceServer.Services.Contracts;

using Microsoft.Data.Sqlite;

namespace InvoiceServer.Services
{
  

  public class InvoiceServices : IInvoiceServices
  {
    private readonly string _cns;
    public InvoiceServices(IConfiguration configuration)
    {
      _cns = configuration.GetConnectionString("InvoiceDB") ?? "Data Source=invoice.db";
    }
    public async Task EnsureTablesExistAsync()
    {
      using (var connection = new SqliteConnection(_cns))
      {
        connection.Open();

        var existsCmd = connection.CreateCommand();
        existsCmd.CommandText = @"SELECT EXISTS (
          SELECT name
          FROM sqlite_schema
          WHERE type='table' AND name='baseData'
          ) as e";
        var exists = await existsCmd.ExecuteScalarAsync();
        if ((Int64?)exists != 1)
        {
          existsCmd.CommandText = @"create table baseData(version INTEGER PRIMARY KEY, supplies TEXT, prices TEXT)";
          await existsCmd.ExecuteNonQueryAsync();
        }

        existsCmd.CommandText = @"SELECT EXISTS (
          SELECT name
          FROM sqlite_schema
          WHERE type='table' AND name='users'
          ) as e";
        exists = await existsCmd.ExecuteScalarAsync();
        if ((Int64?)exists != 1)
        {
          existsCmd.CommandText = @"CREATE TABLE Users (
                  Id INTEGER PRIMARY KEY,
                  Name TEXT,
                  UserName TEXT,
                  Title TEXT,
                  Email TEXT,
                  Phone TEXT,
                  Role TEXT NOT NULL,
                  PasswordHash INTEGER NOT NULL,
                  EmailConfirmed INTEGER NOT NULL,
                  Enabled INTEGER NOT NULL,
                  CreatedDateTime TEXT,
                  ModifiedDateTime TEXT
              );";
          await existsCmd.ExecuteNonQueryAsync();
        }
      }
    }
    public async Task<(int, string, string)> GetBaseDataAsync(int version)
    {
      using (var connection = new SqliteConnection(_cns))
      {
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"SELECT * FROM basedata where version > @version ORDER BY version DESC LIMIT 1";
        cmd.Parameters.AddWithValue("@version", version);
        var reader = await cmd.ExecuteReaderAsync();
        if (reader.HasRows)
        {
          await reader.ReadAsync();
          return (reader.GetInt32(0), reader.GetString(1), reader.GetString(2));
        }
        return (-1, string.Empty, string.Empty);
      }
    }

    public async Task SaveBaseDataAsync(int version, string supplies, string prices)
    {
      using (var connection = new SqliteConnection(_cns))
      {
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "insert or replace into baseData(version,supplies,prices) values (@version,@supplies,@prices)";
        cmd.Parameters.AddWithValue("@version", version);
        cmd.Parameters.AddWithValue("@supplies", supplies);
        cmd.Parameters.AddWithValue("@prices", prices);
        await cmd.ExecuteNonQueryAsync();
      }
    }
  }
}

