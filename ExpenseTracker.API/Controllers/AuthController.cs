using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // REGISTER
  [HttpPost("register")]
public async Task<IActionResult> Register(User user)
{
    try
    {
        if (await _context.Users.AnyAsync(x => x.Email == user.Email))
            return BadRequest("Email already exists");

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("Registration Successful");
    }
    catch (Exception ex)
    {
        return StatusCode(500, ex.Message);
    }
}

 // LOGIN
[HttpPost("login")]
public async Task<IActionResult> Login(LoginRequest login)
{
    var user = await _context.Users.FirstOrDefaultAsync(x =>
        x.Email == login.Email &&
        x.Password == login.Password);

    if (user == null)
        return Unauthorized("Invalid Email or Password");

    return Ok(new
    {
        message = "Login Successful",
        id = user.Id,
        name = user.Name,
        email = user.Email
    });
}
}