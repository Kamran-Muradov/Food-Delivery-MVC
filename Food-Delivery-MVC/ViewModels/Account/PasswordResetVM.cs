using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Account
{
    public class PasswordResetVM
    {
        public string UserId { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }
        public string Token { get; set; }
    }
}
