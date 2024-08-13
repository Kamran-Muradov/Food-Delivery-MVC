namespace Food_Delivery_MVC.ViewModels.UI.Basket
{
    public class BasketCreateVM
    {
        public decimal Price { get; set; }
        public int Count { get; set; }
        public int MenuId { get; set; }
        public int RestaurantId { get; set; }
        public string UserId { get; set; }
        public Dictionary<string,List<string>>? BasketVariants { get; set; }
    }
}
