using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Restaurants;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class RestaurantController : BaseController
    {
        public RestaurantController(HttpClient httpClient) : base(httpClient) { }
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/Restaurant/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<RestaurantVM> model = JsonConvert.DeserializeObject<PaginationResponse<RestaurantVM>>(data);

            return View(model);
        }
    }
}
