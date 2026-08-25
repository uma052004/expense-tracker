using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpensesController(AppDbContext context)
    {
        _context = context;
    }

    // GET expenses by user
    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses(int userId)
    {
        return await _context.Expenses
            .Where(e => e.UserId == userId)
            .ToListAsync();
    }

    // ADD expense
    [HttpPost]
    public async Task<ActionResult<Expense>> AddExpense(Expense expense)
    {
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return Ok(expense);
    }

    // UPDATE expense
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExpense(int id, Expense expense)
    {
        if (id != expense.Id)
            return BadRequest();

        var existing = await _context.Expenses.FindAsync(id);

        if (existing == null)
            return NotFound();

        existing.Title = expense.Title;
        existing.Amount = expense.Amount;
        existing.Category = expense.Category;
        existing.Date = expense.Date;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE expense
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
            return NotFound();

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}