using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Countries
{
    public class CountryEditVM
    {
        [Required]
        public string Name { get; set; }
    }
}
