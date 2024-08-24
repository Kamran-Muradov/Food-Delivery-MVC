namespace Food_Delivery_MVC.ViewModels.Account
{
    public class UserDetailVM
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string ProfilePicture { get; set; }
        public ICollection<string> Roles { get; set; }
    }
}
