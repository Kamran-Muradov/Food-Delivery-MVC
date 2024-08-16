using Food_Delivery_MVC.ViewModels.UI.Menus;
using Food_Delivery_MVC.ViewModels.UI.Reviews;

namespace Food_Delivery_MVC.ViewModels.UI.Restaurants
{
    public class RestaurantDetailVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public decimal DeliveryFee { get; set; }
        public bool IsActive { get; set; }
        public decimal MinimumOrder { get; set; }
        public int MinDeliveryTime { get; set; }
        public double AverageRating { get; set; }
        public string Address { get; set; }
        public string? Website { get; set; }
        public IEnumerable<RestaurantImageVM> RestaurantImages { get; set; }
        public IEnumerable<MenuVM> Menus { get; set; }
        public IEnumerable<ReviewVM> Reviews { get; set; }
    }
}
