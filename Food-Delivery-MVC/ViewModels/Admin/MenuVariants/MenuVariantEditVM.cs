using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.MenuVariants
{
    public class MenuVariantEditVM
    {
        [Required]
        public int MenuId { get; set; }
        [Required]
        public int VariantTypeId { get; set; }
        [Required]
        public string Option { get; set; }
        [Required]
        public decimal AdditionalPrice { get; set; }
        [Required]
        public bool IsSingleChoice { get; set; }
    }
}
