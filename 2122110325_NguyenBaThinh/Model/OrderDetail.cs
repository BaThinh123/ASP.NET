using _2122110325_NguyenBaThinh.Model;
using System.Text.Json.Serialization;

namespace _2122110325_NguyenBaThinh.Data
{
    public class OrderDetail
    {
        public int Id { get; set; }
        public int? OrderId { get; set; }
        public int? ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }

        [JsonIgnore] // ✅ Tránh vòng lặp Order → OrderDetails → Order
        public Order? Order { get; set; }

        [JsonIgnore] // ✅ Nếu Product có OrderDetails thì vòng sẽ quay lại
        public Product? Product { get; set; }
    }
}
