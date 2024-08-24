using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Countries
{
    public class CountryCreateVM
    {
        [Required]
        public string Name { get; set; }
    }
}
