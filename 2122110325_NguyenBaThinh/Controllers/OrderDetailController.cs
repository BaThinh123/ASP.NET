using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _2122110325_NguyenBaThinh.Data;
using _2122110325_NguyenBaThinh.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace _2122110325_NguyenBaThinh.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // ✅ Yêu cầu đăng nhập bằng JWT cho toàn bộ OrderDetailController
    public class OrderDetailController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderDetailController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetOrderDetails()
        {
            return await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .ToListAsync();
        }

        // GET: api/OrderDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetail>> GetOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
            {
                return NotFound();
            }

            return orderDetail;
        }

        // POST: api/OrderDetails
        [HttpPost]
        public async Task<ActionResult<OrderDetail>> PostOrderDetail(OrderDetail orderDetail)
        {
            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderDetail), new { id = orderDetail.Id }, orderDetail);
        }

        // PUT: api/OrderDetails/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderDetail(int id, OrderDetail updatedData)
        {
            var existing = await _context.OrderDetails.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.OrderId = updatedData.OrderId;
            existing.ProductId = updatedData.ProductId;
            existing.Quantity = updatedData.Quantity;
            existing.UnitPrice = updatedData.UnitPrice;
            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedBy = updatedData.UpdatedBy;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/OrderDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null)
                return NotFound();

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
