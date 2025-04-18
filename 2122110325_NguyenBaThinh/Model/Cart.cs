using _2122110325_NguyenBaThinh.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Cart
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    public User? User { get; set; }
    public ICollection<CartItem>? CartItems { get; set; }
    public ICollection<Order>? Orders { get; set; }
}
