
using Microsoft.AspNetCore.Mvc;
using DinkToPdf;
using DinkToPdf.Contracts;


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
    }
}