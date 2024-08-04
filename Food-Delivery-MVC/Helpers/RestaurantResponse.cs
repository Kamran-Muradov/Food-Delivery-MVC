using Food_Delivery_MVC.ViewModels.UI.Restaurants;
using Food_Delivery_MVC.ViewModels.UI.Tags;

namespace Food_Delivery_MVC.Helpers
{
    public class RestaurantResponse
    {
        public PaginationResponse<RestaurantVM> Restaurants { get; set; }
        public IEnumerable<TagVM> Tags { get; set; }
    }
}
