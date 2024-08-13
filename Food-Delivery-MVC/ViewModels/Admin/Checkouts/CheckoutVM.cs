namespace Food_Delivery_MVC.ViewModels.Admin.Checkouts
{
    public class CheckoutVM
    {
        public int Id { get; set; }
        public string CreatedDate { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
        public string UserName { get; set; }
    }
}
