namespace Food_Delivery_MVC.ViewModels.UI.Reviews
{
    public class ReviewVM
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string UserName { get; set; }
        public string UserImage { get; set; }
        public string CreatedDate { get; set; }
    }
}
