using System.ComponentModel.DataAnnotations;

namespace Food_Delivery_MVC.ViewModels.Admin.Restaurants
{
    public class RestaurantEditVM
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Phone { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public decimal DeliveryFee { get; set; }
        [Required]
        public int MinDeliveryTime { get; set; }
        [Required]
        public string Address { get; set; }
        public string Website { get; set; }
        [Required]
        public List<IFormFile>? Images { get; set; }
        [Required]
        public List<int> TagIds { get; set; }
        [Required]
        public int? BrandId { get; set; }
        [Required]
        public int CityId { get; set; }
    }
}
