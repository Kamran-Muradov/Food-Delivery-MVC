using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Categories;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    [Area("Admin")]
    //[Authorize(Policy = "RequireAdminRole")]
    public class CategoryController : BaseController
    {
        //private readonly Uri _baseUri = new("https://localhost:7247/api/");
        //private readonly HttpClient _httpClient;

        //public CategoryController(HttpClient httpClient)
        //{
        //    _httpClient = httpClient;
        //    _httpClient.BaseAddress = _baseUri;
        //}
        public CategoryController(HttpClient httpClient) : base(httpClient) { }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/category/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<CategoryVM> model = JsonConvert.DeserializeObject<PaginationResponse<CategoryVM>>(data);

            return View(model);
        }

        
    }
}
