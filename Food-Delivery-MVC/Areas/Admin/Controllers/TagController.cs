using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Tags;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class TagController : BaseController
    {
        public TagController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/tag/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<TagVM> model = JsonConvert.DeserializeObject<PaginationResponse<TagVM>>(data);

            return View(model);
        }
    }
}
