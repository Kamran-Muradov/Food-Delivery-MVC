using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Countries;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class CountryController : BaseController
    {
        public CountryController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/country/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<CountryVM> model = JsonConvert.DeserializeObject<PaginationResponse<CountryVM>>(data);

            return View(model);
        }
    }
}
