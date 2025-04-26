using System.Text.Json.Serialization;
using _2122110325_NguyenBaThinh.Model;

namespace _2122110325_NguyenBaThinh.Model
{
    public class CartItem
    {
        public int Id { get; set; }
        public int? CartId { get; set; }
        public int? ProductId { get; set; }
        public int Quantity { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }

        [JsonIgnore]
        public Cart? Cart { get; set; }

        public Product? Product { get; set; }
    }
}
