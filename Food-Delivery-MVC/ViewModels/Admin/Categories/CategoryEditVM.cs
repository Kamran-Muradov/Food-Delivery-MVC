using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Categories
{
    public class CategoryEditVM
    {
        [Required]
        public string Name { get; set; }
        public IFormFile? Image { get; set; }
    }
}
