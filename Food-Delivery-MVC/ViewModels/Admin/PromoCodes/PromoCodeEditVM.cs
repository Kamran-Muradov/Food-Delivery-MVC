namespace Food_Delivery_MVC.ViewModels.Admin.PromoCodes
{
    public class PromoCodeEditVM
    {
        public decimal Discount { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsActive { get; set; }
    }
}
