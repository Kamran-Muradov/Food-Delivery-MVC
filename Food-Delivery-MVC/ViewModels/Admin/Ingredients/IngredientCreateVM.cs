using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Ingredients
{
    public class IngredientCreateVM
    {
        [Required]
        public string Name { get; set; }
    }
}
