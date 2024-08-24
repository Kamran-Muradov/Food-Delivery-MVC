namespace Food_Delivery_MVC.ViewModels.Admin.Menus
{
    public class MenuDetailVM
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Restaurant { get; set; }
        public string Image { get; set; }
        public IEnumerable<string> Ingredients { get; set; }
        public string Category { get; set; }
        public string CreatedDate { get; set; }
        public string UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}
