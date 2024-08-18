using Food_Delivery_MVC.ViewModels.UI.Restaurants;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class BrandController : BaseController
    {
        public BrandController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> GetByName(string name)
        {
            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"restaurant/getAllByBrandName?brandName={name}");
            responseMessage.EnsureSuccessStatusCode();

            var data = await responseMessage.Content.ReadAsStringAsync();

            ViewBag.BrandName = name;
            return View(JsonConvert.DeserializeObject<IEnumerable<RestaurantVM>>(data));
        }
    }
}
