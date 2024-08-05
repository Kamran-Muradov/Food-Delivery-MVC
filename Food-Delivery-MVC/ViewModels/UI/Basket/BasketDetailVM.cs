namespace Food_Delivery_MVC.ViewModels.UI.Basket
{
    public class BasketDetailVM
    {
        public int MenuId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Count { get; set; }
        public string Restaurant { get; set; }
        public string Image { get; set; }
        public Dictionary<string, List<string>> BasketVariants { get; set; }
    }
}
