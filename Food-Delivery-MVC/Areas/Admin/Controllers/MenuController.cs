using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Menus;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class MenuController : BaseController
    {
        public MenuController(HttpClient httpClient) : base(httpClient) { }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/menu/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<MenuVM> model = JsonConvert.DeserializeObject<PaginationResponse<MenuVM>>(data);

            return View(model);
        }
    }
}
