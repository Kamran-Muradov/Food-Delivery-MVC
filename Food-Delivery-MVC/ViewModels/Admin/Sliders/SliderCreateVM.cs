using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Sliders
{
    public class SliderCreateVM
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public IFormFile Image { get; set; }
    }
}
