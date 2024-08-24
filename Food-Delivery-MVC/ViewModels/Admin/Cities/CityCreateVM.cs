using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Cities
{
    public class CityCreateVM
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int CountryId { get; set; }
    }
}
