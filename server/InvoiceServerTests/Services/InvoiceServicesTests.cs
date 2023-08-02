using Microsoft.VisualStudio.TestTools.UnitTesting;
using InvoiceServer.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InvoiceServer.Services.Tests
{
  [TestClass()]
  public class InvoiceServicesTests
  {
    [TestMethod()]
    public void EnsureTablesExistTest()
    {
      var service = new InvoiceServices("Data Source=d:\\temp\\invoice.db");
      service.EnsureTablesExist().Wait();
      Assert.Fail();
    }

    [TestMethod()]
    public void GetBaseDataReturnsTuple()
    {
      var service = new InvoiceServices("Data Source=d:\\temp\\invoice.db");
      service.EnsureTablesExist().Wait();
      var x = service.GetBaseDataAsync(0).Result;
      Assert.IsNotNull(x);
    }
    [TestMethod]
    public void SaveBaseDataReturnNoExceptions()
    {      var service = new InvoiceServices("Data Source=d:\\temp\\invoice.db");
      int version = 1;
      string supplies = File.ReadAllText(@"d:\Temp\supplies.txt",Encoding.UTF8).Trim();
      string prices=string.Empty;
      service.SaveBaseDataAsync(version, supplies, prices).Wait();
    }
  }
}
