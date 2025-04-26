using System.Text.Json.Serialization;
using _2122110325_NguyenBaThinh.Data;

namespace _2122110325_NguyenBaThinh.Model
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? CartId { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }

        [JsonIgnore] // ✅ Tránh vòng lặp Order → User → Orders → Order
        public User? User { get; set; }

        [JsonIgnore] // ✅ Tránh vòng lặp Order → Cart → Orders → Order
        public Cart? Cart { get; set; }

        public ICollection<OrderDetail>? OrderDetails { get; set; }

        [JsonIgnore] // Nếu Payment có navigation ngược về Order thì nên thêm luôn
        public ICollection<Payment>? Payments { get; set; }
    }
}
