using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace _2122110325_NguyenBaThinh.Model
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Order")]
        public int? OrderId { get; set; }

        [Required]
        [StringLength(50)]
        public string? PaymentMethod { get; set; }

        [StringLength(50)]
        public string? PaymentStatus { get; set; }

        public DateTime? PaymentDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [StringLength(100)]
        public string? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [StringLength(100)]
        public string? UpdatedBy { get; set; }

        // Navigation property
        public Order? Order { get; set; }
    }
}
