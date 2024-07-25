using Food_Delivery_MVC.Helpers.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    public class HomeController : Controller
    {
        private readonly Uri _baseUri = new("https://localhost:7247/api/");
        private readonly HttpClient _httpClient;

        public HomeController(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = _baseUri;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }
    }


}
