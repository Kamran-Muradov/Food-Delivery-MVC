using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Settings
{
    public class SettingEditVM
    {
        [Required]
        public string Value { get; set; }
    }
}
