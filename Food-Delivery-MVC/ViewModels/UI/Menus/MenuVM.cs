using Food_Delivery_MVC.ViewModels.UI.Categories;

namespace Food_Delivery_MVC.ViewModels.UI.Menus
{
    public class MenuVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public IEnumerable<string> Ingredients { get; set; }
        public string Image { get; set; }
        public CategoryVM Category { get; set; }
    }
}
