using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Controllers
{
    public class HomeController : BaseController
    {
        public HomeController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }
    }
}
