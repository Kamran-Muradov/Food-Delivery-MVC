using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Ingredients;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class IngredientController : BaseController
    {
        public IngredientController(HttpClient httpClient) : base(httpClient) { }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/ingredient/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<IngredientVM> model = JsonConvert.DeserializeObject<PaginationResponse<IngredientVM>>(data);

            return View(model);
        }
    }
}
