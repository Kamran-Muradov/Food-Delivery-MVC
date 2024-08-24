using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.VariantTypes
{
    public class VariantTypeCreateVM
    {
        [Required]
        public string Name { get; set; }
    }
}
