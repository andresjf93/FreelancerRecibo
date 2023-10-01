using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DinkToPdf;
using DinkToPdf.Contracts;
using FreelancerRecibo.Models;

namespace FreelancerRecibo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CrearController : ControllerBase
    {
        private readonly IConverter _pdfConverter;
        private readonly DatosClienteContext _dbContext;

        public CrearController(IConverter pdfConverter, DatosClienteContext dbContext)
        {
            _pdfConverter = pdfConverter;
            _dbContext = dbContext;
        }

        [HttpPost]
        [Route("GenerarPDF")]
        public IActionResult GenerarPDF([FromBody] string htmlContent)
        {
            try
            {
                var globalSettings = new GlobalSettings
                {
                    PaperSize = PaperKind.A4,
                    Orientation = Orientation.Portrait,
                };

                var objectSettings = new ObjectSettings
                {
                    PagesCount = true,
                    HtmlContent = htmlContent,
                    WebSettings = { DefaultEncoding = "utf-8" },
                };

                var pdfDocument = new HtmlToPdfDocument()
                {
                    GlobalSettings = globalSettings,
                    Objects = { objectSettings },
                };

                var pdfBytes = _pdfConverter.Convert(pdfDocument);

                return File(pdfBytes, "application/pdf", "recibo.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al generar el PDF: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("Lista")]
        public IActionResult Lista()
        {
            try
            {
                var list = _dbContext.UsuariosRegisters
                    .OrderByDescending(t => t.Nombres)
                    .ThenBy(t => t.TipoDocumento)
                    .ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener la lista de usuarios: {ex.Message}");
            }
        }
    }
}
