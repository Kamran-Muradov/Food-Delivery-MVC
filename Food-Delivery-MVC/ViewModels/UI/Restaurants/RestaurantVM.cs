using Food_Delivery_MVC.ViewModels.UI.Tags;

namespace Food_Delivery_MVC.ViewModels.UI.Restaurants
{
    public class RestaurantVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int MinDeliveryTime { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public string Brand { get; set; }
        public decimal DeliveryFee { get; set; }
        public IEnumerable<TagVM> Tags { get; set; }
        public IEnumerable<RestaurantImageVM> RestaurantImages { get; set; }
    }
}
