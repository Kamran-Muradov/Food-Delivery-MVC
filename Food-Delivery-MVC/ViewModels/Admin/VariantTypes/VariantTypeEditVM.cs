using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.VariantTypes
{
    public class VariantTypeEditVM
    {
        [Required]
        public string Name { get; set; }
    }
}
