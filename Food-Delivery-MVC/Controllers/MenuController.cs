using Food_Delivery_MVC.ViewModels.UI.Menus;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class MenuController : BaseController
    {
        public MenuController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Detail(int? id)
        {
            if (id is null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"menu/getById/{id}");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            return PartialView("_Detail", JsonConvert.DeserializeObject<MenuDetailVM>(data));
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] int? restaurantId, [FromQuery] string? searchText)
        {
            if (restaurantId is null) return BadRequest();

            HttpResponseMessage response = await HttpClient.GetAsync($"menu/search?restaurantId={restaurantId}&searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<MenuVM> model = JsonConvert.DeserializeObject<IEnumerable<MenuVM>>(data);

            return PartialView("_SearchResult", model);
        }
    }
}
