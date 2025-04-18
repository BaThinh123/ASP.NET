using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _2122110325_NguyenBaThinh.Data;
using _2122110325_NguyenBaThinh.Model;

namespace _2122110325_NguyenBaThinh.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // ✅ Bảo vệ toàn bộ BrandController bằng JWT
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Brand
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetBrands()
        {
            return await _context.Brands.ToListAsync();
        }

        // GET: api/Brand/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Brand>> GetBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
            {
                return NotFound();
            }

            return brand;
        }

        // POST: api/Brand
        [HttpPost]
        public async Task<ActionResult<Brand>> PostBrand(Brand brand)
        {
            brand.CreatedAt = DateTime.UtcNow;
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, brand);
        }

        // PUT: api/Brand/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand(int id, Brand brand)
        {
            if (id != brand.Id)
            {
                return BadRequest();
            }

            var existingBrand = await _context.Brands.FindAsync(id);
            if (existingBrand == null)
            {
                return NotFound();
            }

            existingBrand.Name = brand.Name;
            existingBrand.LogoUrl = brand.LogoUrl;
            existingBrand.Status = brand.Status;
            existingBrand.UpdatedAt = DateTime.UtcNow;
            existingBrand.UpdatedBy = brand.UpdatedBy;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Brand/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return NotFound();
            }

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
