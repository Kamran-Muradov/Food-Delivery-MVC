using Food_Delivery_MVC.ViewModels.UI.Restaurants;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class RestaurantController : BaseController
    {
        public RestaurantController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Search(string searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText)) return BadRequest();

            HttpResponseMessage response = await HttpClient.GetAsync($"restaurant/search?searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<RestaurantVM> model = JsonConvert.DeserializeObject<IEnumerable<RestaurantVM>>(data);

            return View(model);
        }
    }
}
