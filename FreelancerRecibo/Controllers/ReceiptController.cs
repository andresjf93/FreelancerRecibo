using DinkToPdf.Contracts;
using DinkToPdf;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/receipts")]
public class ReceiptController : ControllerBase
{
    private readonly IConverter _pdfConverter;

    public ReceiptController(IConverter pdfConverter)
    {
        _pdfConverter = pdfConverter;
    }
    public class ReceiptData
    {
        public string FullName { get; set; }
        public string Currency { get; set; }
        public decimal Amount { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string Logo { get; set; } // Agrega el campo para el logo aquí
        public string DocumentType { get; set; }
        public string DocumentNumber { get; set; }
    }

    [HttpPost]
    public IActionResult GenerateReceipt([FromBody] ReceiptData receiptData)
    {
        // Crear HTML con los datos del recibo y el logo
        string htmlContent = $@"
            <html>
                <head>
                    <title>Recibo</title>
                </head>
                <body>
                    <h1>Recibo</h1>
                    <img src='{receiptData.Logo}' alt='Logo de Marca' width='200' />
                    <p>Nombre: {receiptData.FullName}</p>
                    <p>Tipo de Moneda: {receiptData.Currency}</p>
                    <p>Monto a Cobrar: {receiptData.Amount}</p>
                    <p>Título del Recibo: {receiptData.Title}</p>
                    <p>Descripción: {receiptData.Description}</p>
                    <p>Dirección: {receiptData.Address}</p>
                    <p>Tipo de Documento: {receiptData.DocumentType}</p>
                    <p>Número de Documento: {receiptData.DocumentNumber}</p>
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

