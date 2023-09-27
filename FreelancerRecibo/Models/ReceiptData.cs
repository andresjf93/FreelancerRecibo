using System.ComponentModel.DataAnnotations;

namespace FreelancerRecibo.Models
{
    public class ReceiptData
    {
        [Required]
        public string Logo { get; set; }

        [Required]
        public string Currency { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor que cero.")]
        public decimal Amount { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string FullName { get; set; }
        public string DocumentType { get; set; }
        public string DocumentNumber { get; set; }
    }
}