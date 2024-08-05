namespace Food_Delivery_MVC.ViewModels.UI.Basket
{
    public class BasketVM
    {
        public int MenuId { get; set; }
        public decimal Price { get; set; }
        public int Count { get; set; }
        public Dictionary<string, List<string>> BasketVariants { get; set; }
    }
}
