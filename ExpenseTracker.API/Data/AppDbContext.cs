using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Expenses table
    public DbSet<Expense> Expenses { get; set; }

    // Users table
    public DbSet<User> Users { get; set; }
}