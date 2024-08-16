using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Abouts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class AboutController : BaseController
    {
        public AboutController(HttpClient httpClient) : base(httpClient)
        {
        }
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/about/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<AboutVM> model = JsonConvert.DeserializeObject<PaginationResponse<AboutVM>>(data);

            return View(model);
        }
    }
}
