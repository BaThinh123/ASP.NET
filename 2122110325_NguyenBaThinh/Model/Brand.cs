using System.Text.Json.Serialization;

namespace _2122110325_NguyenBaThinh.Model
{
    public class Brand
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string? LogoUrl { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
       

        [JsonIgnore] // Thêm dòng này để tránh vòng lặp khi serialize
        public ICollection<Product>? Products { get; set; }
    
    }
}
