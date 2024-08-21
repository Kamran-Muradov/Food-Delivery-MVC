using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.PromoCodes;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class PromoCodeController : BaseController
    {
        public PromoCodeController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/promoCode/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<PromoCodeVM> model = JsonConvert.DeserializeObject<PaginationResponse<PromoCodeVM>>(data);

            return View(model);
        }
    }
}
