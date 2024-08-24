using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.PromoCodes
{
    public class PromoCodeCreateVM
    {
        [Required]
        public decimal Discount { get; set; }
        [Required]
        public DateTime ExpiryDate { get; set; }
    }
}
