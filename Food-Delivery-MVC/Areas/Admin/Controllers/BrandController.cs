using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Brands;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class BrandController : BaseController
    {
        public BrandController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/brand/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<BrandVM> model = JsonConvert.DeserializeObject<PaginationResponse<BrandVM>>(data);

            return View(model);
        }
    }
}
