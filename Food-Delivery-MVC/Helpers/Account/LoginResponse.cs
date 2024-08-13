namespace Food_Delivery_MVC.Helpers.Account
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Error { get; set; }
        public string Token { get; set; }
        public string ProfilePicture { get; set; }
    }
}
