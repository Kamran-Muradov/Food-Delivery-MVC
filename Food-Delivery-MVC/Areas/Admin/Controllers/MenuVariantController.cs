using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.MenuVariants;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class MenuVariantController : BaseController
    {
        public MenuVariantController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/menuvariant/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<MenuVariantVM> model = JsonConvert.DeserializeObject<PaginationResponse<MenuVariantVM>>(data);

            return View(model);
        }
    }
}
