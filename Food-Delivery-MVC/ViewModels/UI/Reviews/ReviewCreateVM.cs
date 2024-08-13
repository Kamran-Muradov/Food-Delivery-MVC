namespace Food_Delivery_MVC.ViewModels.UI.Reviews
{
    public class ReviewCreateVM
    {
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public int CheckoutId { get; set; }
    }
}
