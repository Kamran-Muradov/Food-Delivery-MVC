using Food_Delivery_MVC.ViewModels.UI.Reviews;

namespace Food_Delivery_MVC.ViewModels.UI.Checkouts
{
    public class CheckoutVM
    {
        public int Id { get; set; }
        public decimal TotalPrice { get; set; }
        public string CreatedDate { get; set; }
        public string Status { get; set; }
        public string Restaurant { get; set; }
        public ReviewVM Review { get; set; }
    }
}
