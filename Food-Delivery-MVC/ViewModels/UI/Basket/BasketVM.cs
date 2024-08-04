namespace Food_Delivery_MVC.ViewModels.UI.Basket
{
    public class BasketVM
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public int Count { get; set; }
        public Dictionary<string, List<string>> MenuVariants { get; set; }
    }
}
