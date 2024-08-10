using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Sliders;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class SliderController : BaseController
    {
        public SliderController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/slider/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<SliderVM> model = JsonConvert.DeserializeObject<PaginationResponse<SliderVM>>(data);

            return View(model);
        }
    }
}
