using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Checkouts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class CheckoutController : BaseController
    {
        public CheckoutController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/checkout/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<CheckoutVM> model = JsonConvert.DeserializeObject<PaginationResponse<CheckoutVM>>(data);

            return View(model);
        }
    }
}
