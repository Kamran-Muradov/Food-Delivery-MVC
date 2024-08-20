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

        [Route("/brands/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"restaurant/getAllByBrandId?brandId={id}");
            responseMessage.EnsureSuccessStatusCode();

            var data = await responseMessage.Content.ReadAsStringAsync();

            return View(JsonConvert.DeserializeObject<IEnumerable<RestaurantVM>>(data));
        }
    }
}
