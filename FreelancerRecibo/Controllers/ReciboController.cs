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
    public class ReciboController : ControllerBase
    {
        private readonly IConverter _pdfConverter;

        public ReciboController(IConverter pdfConverter)
        {
            _pdfConverter = pdfConverter;
        }

        [HttpPost]
        public IActionResult GenerateRecibo([FromBody] string jsonData)
        {
            // Convertir el JSON a un objeto ReceiptData
            ReceiptData receiptData = JsonConvert.DeserializeObject<ReceiptData>(jsonData);

            // Crear HTML con los datos del recibo
            string htmlContent = $@"
        <html>
            <head>
                <title>Recibo</title>
            </head>
            <body>
                 <center>
                    <br />
                <h1>Recibo</h1>
                <img src=""{receiptData.Logo}"" alt=""Logo de Marca"" style=""max-width: 100px;"" />
                <br />
                <table>
                <p>Nombre: {receiptData.FullName}</p>
                <p>Tipo de Moneda: {receiptData.Currency}</p>
                <p>Monto a Cobrar: {receiptData.Amount}</p>
                <p>Título del Recibo: {receiptData.Title}</p>
                <p>Descripción: {receiptData.Description}</p>
                <p>Dirección: {receiptData.Address}</p>
                <p>Tipo de Documento: {receiptData.DocumentType}</p>
                <p>Número de Documento: {receiptData.DocumentNumber}</p>
                </table>
                </center>
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
            string nombrePDF = "recibo_" + receiptData.FullName + ".pdf";

            // Devolver el PDF como descarga
            return File(pdfBytes, "application/pdf", nombrePDF);
        }
    }
}
