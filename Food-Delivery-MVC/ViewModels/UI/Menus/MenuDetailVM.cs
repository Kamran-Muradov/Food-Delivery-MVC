using Food_Delivery_MVC.ViewModels.UI.MenuVariants;

namespace Food_Delivery_MVC.ViewModels.UI.Menus
{
    public class MenuDetailVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public IEnumerable<string> Ingredients { get; set; }
        public string Image { get; set; }
        public int RestaurantId { get; set; }
        public string Restaurant { get; set; }
        public decimal DeliveryFee { get; set; }
        public Dictionary<string, IEnumerable<MenuVariantVM>> MenuVariants { get; set; }
    }
}
