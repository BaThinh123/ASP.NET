namespace _2122110325_NguyenBaThinh.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int? CategoryId { get; set; }
        public string Image { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation property
        public Category Category { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
        public ICollection<Cart> Carts { get; set; }
    }


}
