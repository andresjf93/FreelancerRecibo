using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using DinkToPdf;
using DinkToPdf.Contracts;
using System.Drawing;
using FreelancerRecibo.Models;
using Newtonsoft.Json;

namespace FreelancerRecibo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CrearController : ControllerBase
    {
        private readonly IConverter _pdfConverter;

        public CrearController(IConverter pdfConverter)
        {
            _pdfConverter = pdfConverter;
        }

        [HttpPost("GenerarPDF")]
        public IActionResult GenerarPDF([FromBody] string htmlContent)
        {
            try
            {
                // Configuración para la conversión HTML a PDF
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

                // Generar el PDF
                var pdfBytes = _pdfConverter.Convert(pdfDocument);

                // Devolver el PDF como descarga
                return File(pdfBytes, "application/pdf", "recibo.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al generar el PDF: {ex.Message}");
            }
        }
    }
}