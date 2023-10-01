using System;
using System.Collections.Generic;

namespace FreelancerRecibo.Models;

public partial class UsuariosRegister
{
    public int UserId { get; set; }

    public string? Nombres { get; set; }

    public string? TipoDocumento { get; set; }

    public string? NumeroDocumento { get; set; }

    public string? DireccionDomicilio { get; set; }

    public string? Logo { get; set; }
}
