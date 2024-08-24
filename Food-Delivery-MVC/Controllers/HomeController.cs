using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Ingredients;
using Food_Delivery_MVC.ViewModels.UI.Restaurants;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class HomeController : BaseController
    {
        public HomeController(HttpClient httpClient) : base(httpClient)
        {
        }

        public  IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> SearchRestaurants([FromQuery] string searchText)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"restaurant/search?searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<RestaurantVM> model = JsonConvert.DeserializeObject<IEnumerable<RestaurantVM>>(data);

            return PartialView("_SearchResult", model);
        }
    }
}
