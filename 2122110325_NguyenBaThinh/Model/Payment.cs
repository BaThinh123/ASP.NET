namespace _2122110325_NguyenBaThinh.Model
{
    public class Payment
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string Status { get; set; }
        public string TransactionId { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Order Order { get; set; }
        public User User { get; set; }
    }

}
