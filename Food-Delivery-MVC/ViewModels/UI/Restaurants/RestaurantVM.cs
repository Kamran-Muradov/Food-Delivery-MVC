using Food_Delivery_MVC.ViewModels.UI.Tags;

namespace Food_Delivery_MVC.ViewModels.UI.Restaurants
{
    public class RestaurantVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MinDeliveryTime { get; set; }
        public int Rating { get; set; }
        public double AverageRating { get; set; }
        public decimal MinimumOrder { get; set; }
        public decimal DeliveryFee { get; set; }
        public IEnumerable<TagVM> Tags { get; set; }
        public IEnumerable<RestaurantImageVM> RestaurantImages { get; set; }
    }
}
