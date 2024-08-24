using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Menus
{
    public class MenuCreateVM
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int RestaurantId { get; set; }
        [Required]
        public IFormFile Image { get; set; }
        [Required]
        public List<int> IngredientIds { get; set; }
        [Required]
        public int CategoryId { get; set; }
    }
}
