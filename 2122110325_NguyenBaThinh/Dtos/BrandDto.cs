using Microsoft.AspNetCore.Http;

namespace _2122110325_NguyenBaThinh.Dtos
{
    public class BrandDto
    {
        public int? Id { get; set; } // Dùng cho cập nhật (PUT)
        public string Name { get; set; } = null!;
        public string Status { get; set; } = "Active";
        public IFormFile? Logo { get; set; } // Hình ảnh upload từ React
        public string? LogoUrl { get; set; } // Đường dẫn ảnh (nếu đã lưu)
        public string? CreatedBy { get; set; }
    }
}
