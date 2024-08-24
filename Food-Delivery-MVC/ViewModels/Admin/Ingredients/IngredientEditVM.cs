using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Ingredients
{
    public class IngredientEditVM
    {
        [Required]
        public string Name { get; set; }
    }
}
