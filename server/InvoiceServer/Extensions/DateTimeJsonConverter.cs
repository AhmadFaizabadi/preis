using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Shop.UI.Extensions
{
    public class DateTimeJsonConverter : JsonConverter<DateTime>
    {
        private readonly IFormatProvider _farsi = CultureInfo.GetCultureInfo("fa-IR");
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string s = reader.GetString();
            DateTime.TryParse(s, _farsi, DateTimeStyles.AssumeLocal, out DateTime result);
            return result;
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            string s = value.Ticks>10 ? value.ToString("yyyy/MM/dd HH:mm", _farsi):"";
            writer.WriteStringValue(s);
        }
    }

}

