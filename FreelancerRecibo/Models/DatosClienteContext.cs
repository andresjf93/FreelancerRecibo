using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FreelancerRecibo.Models;

public partial class DatosClienteContext : DbContext
{
    public DatosClienteContext()
    {
    }

    public DatosClienteContext(DbContextOptions<DatosClienteContext> options)
        : base(options)
    {
    }

    public virtual DbSet<UsuariosRegister> UsuariosRegisters { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-2463C46; DataBase=DatosCliente;Integrated Security=true;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UsuariosRegister>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Usuarios__1788CCACD848910C");

            entity.ToTable("UsuariosRegister");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.DireccionDomicilio).HasMaxLength(255);
            entity.Property(e => e.Logo).HasMaxLength(255);
            entity.Property(e => e.Nombres).HasMaxLength(255);
            entity.Property(e => e.NumeroDocumento).HasMaxLength(50);
            entity.Property(e => e.TipoDocumento).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
