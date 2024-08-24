namespace Food_Delivery_MVC.ViewModels.Admin.MenuVariants
{
    public class MenuVariantDetailVM
    {
        public string Option { get; set; }
        public decimal AdditionalPrice { get; set; }
        public string CreatedDate { get; set; }
        public string UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string VariantType { get; set; }
        public string Menu { get; set; }
        public bool IsSingleChoice { get; set; }
    }
}
