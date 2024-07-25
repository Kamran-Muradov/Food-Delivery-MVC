using Food_Delivery_MVC.ViewModels.Restaurants;
using Food_Delivery_MVC.ViewModels.Categories;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Food_Delivery_MVC.Helpers;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CategoryController : Controller
    {
        private readonly Uri _baseUri = new("https://localhost:7247/api/");
        private readonly HttpClient _httpClient;

        public CategoryController(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = _baseUri;
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await _httpClient.GetAsync("admin/category/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<CategoryVM> model = JsonConvert.DeserializeObject<PaginationResponse<CategoryVM>>(data);

            return View(model);
        }
    }
}
