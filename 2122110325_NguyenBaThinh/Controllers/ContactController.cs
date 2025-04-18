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
    [Authorize]  // Yêu cầu xác thực cho tất cả các action trong controller này
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Contacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            return await _context.Contacts.ToListAsync();
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        // POST: api/Contacts
        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }

        // PUT: api/Contacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, Contact updatedContact)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
                return NotFound();

            contact.FullName = updatedContact.FullName;
            contact.Email = updatedContact.Email;
            contact.Subject = updatedContact.Subject;
            contact.Message = updatedContact.Message;
            contact.Status = updatedContact.Status;
            contact.UpdatedAt = DateTime.UtcNow;
            contact.UpdatedBy = updatedContact.UpdatedBy;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
                return NotFound();

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
