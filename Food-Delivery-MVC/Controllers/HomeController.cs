using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Controllers
{
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
