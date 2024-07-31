using Food_Delivery_MVC.ViewModels.UI.Categories;
using Food_Delivery_MVC.ViewModels.UI.Restaurants;

namespace Food_Delivery_MVC.Helpers
{
    public class RestaurantResponse
    {
        public PaginationResponse<RestaurantVM> Restaurants { get; set; }
        public IEnumerable<CategoryVM> Categories { get; set; }
    }
}
