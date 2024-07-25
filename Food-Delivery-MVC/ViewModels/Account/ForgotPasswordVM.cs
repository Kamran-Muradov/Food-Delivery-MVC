using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Account
{
    public class ForgotPasswordVM
    {
        [Required]
        public string EmailOrUserName { get; set; }
    }
}
