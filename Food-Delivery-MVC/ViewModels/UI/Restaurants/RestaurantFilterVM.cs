namespace Food_Delivery_MVC.ViewModels.UI.Restaurants
{
    public class RestaurantFilterVM
    {
        public int Page { get; set; } = 1;
        public int Take { get; set; } = 6;
        public string Sorting { get; set; } = "recent";
        public List<int>? CategoryIds { get; set; }
    }
}
