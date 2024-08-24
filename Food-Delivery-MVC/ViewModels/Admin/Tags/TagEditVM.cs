using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Tags
{
    public class TagEditVM
    {
        [Required]
        public string Name { get; set; }
        public IFormFile? Image { get; set; }
    }
}
