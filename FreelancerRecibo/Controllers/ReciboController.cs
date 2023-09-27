using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DinkToPdf;
using DinkToPdf.Contracts;

namespace FreelancerRecibo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReciboController : ControllerBase
    {
        private readonly IConverter _pdfConverter;
        public ReciboController(IConverter pdfConverter)
        {
            _pdfConverter = pdfConverter;
        }
        [HttpPost]
        [Route("GenerateRecibo")]
        public IActionResult GenerateRecibo([FromBody] ReceiptData receiptData)
        {
            // Accede a los datos del recibo utilizando la clase ReceiptData

            string logoUrl = receiptData.Logo;
            string currency = receiptData.Currency;
            decimal amount = receiptData.Amount;
            string title = receiptData.Title;
            string description = receiptData.Description;
            string address = receiptData.Address;
            string fullName = receiptData.FullName;
            string documentType = receiptData.DocumentType;
            string documentNumber = receiptData.DocumentNumber;
            // Crear HTML con los datos del recibo
            string htmlContent = $@"
                  <html>
                     <head>
                        <title>Recibo</title>
                      </head>
                        <body>
                               <h1>Recibo</h1>
                        <img src=""{logoUrl}"" alt=""Logo de Marca"" style=""max-width: 100px;"" />
                        <p>Nombre: {fullName}</p>
                        <p>Tipo de Moneda: {currency}</p>
                        <p>Monto a Cobrar: {amount}</p>
                        <p>Título del Recibo: {title}</p>
                        <p>Descripción: {description}</p>
                        <p>Dirección: {address}</p>
                        <p>Tipo de Documento: {documentType}</p>
                        <p>Número de Documento: {documentNumber}</p>
                        <!-- Agregar más datos aquí -->
                    </body>
                </html>";

            // Configurar la conversión de HTML a PDF
            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                    PaperSize = PaperKind.A4,
                    Orientation = Orientation.Portrait,
                },
                Objects = {
                    new ObjectSettings()
                    {
                        PagesCount = true,
                        HtmlContent = htmlContent,
                    }
                }
            };

            // Convertir HTML a PDF
            byte[] pdfBytes = _pdfConverter.Convert(pdf);

            // Devolver el PDF como descarga
            return File(pdfBytes, "application/pdf", "recibo.pdf");
        }
    }
    
}
