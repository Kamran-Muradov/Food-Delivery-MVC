using Food_Delivery_MVC.ViewModels.UI.Reviews;

namespace Food_Delivery_MVC.ViewModels.UI.Checkouts
{
    public class CheckoutDetailVM
    {
        public decimal TotalPrice { get; set; }
        public string CreatedDate { get; set; }
        public string Status { get; set; }
        public string Address { get; set; }
        public string? Comments { get; set; }
        public string Restaurant { get; set; }
        public ICollection<string> Items { get; set; }
        public ReviewVM Review { get; set; }
    }
}
