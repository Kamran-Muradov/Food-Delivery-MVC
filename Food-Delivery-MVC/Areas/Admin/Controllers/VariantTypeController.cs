using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.VariantTypes;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class VariantTypeController : BaseController
    {
        public VariantTypeController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/variantType/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<VariantTypeVM> model = JsonConvert.DeserializeObject<PaginationResponse<VariantTypeVM>>(data);

            return View(model);
        }
    }
}
