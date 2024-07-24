namespace Food_Delivery_MVC.Helpers
{
    public class RegisterResponse
    {
        public bool Success { get; set; }
        public IEnumerable<string> Errors { get; set; }
        public bool IsEmailTaken { get; set; }
        public bool IsUsernameTaken { get; set; }
        public string UserId { get; set; }
        public string ConfirmationToken { get; set; }
    }
}
