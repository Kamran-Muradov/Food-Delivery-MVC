using Food_Delivery_MVC.ViewModels.UI.Categories;

namespace Food_Delivery_MVC.ViewModels.UI.Restaurants
{
    public class RestaurantVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MinDeliveryTime { get; set; }
        public int Rating { get; set; }
        public decimal MinimumOrder { get; set; }
        public IEnumerable<CategoryVM> Categories { get; set; }
        public IEnumerable<RestaurantImageVM> RestaurantImages { get; set; }
    }
}
