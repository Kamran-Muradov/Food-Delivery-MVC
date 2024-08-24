using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.SocialMedias
{
    public class SocialMediaCreateVM
    {
        [Required]
        public string Platform { get; set; }
        [Required]
        public string Url { get; set; }
    }
}
