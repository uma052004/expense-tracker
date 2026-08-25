using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.API.Models;

public class Expense
{
    public int Id { get; set; }

    public int UserId { get; set; }   // NEW

    [Required]
    public string Title { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    [Required]
    public string Category { get; set; } = string.Empty;

    public DateTime Date { get; set; }
}