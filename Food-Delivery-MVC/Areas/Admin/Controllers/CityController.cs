using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Cities;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class CityController : BaseController
    {
        public CityController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/city/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<CityVM> model = JsonConvert.DeserializeObject<PaginationResponse<CityVM>>(data);

            return View(model);
        }
    }
}
