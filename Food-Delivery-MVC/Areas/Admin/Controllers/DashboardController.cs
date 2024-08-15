using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class DashboardController : BaseController
    {
        public DashboardController(HttpClient httpClient) : base(httpClient) { }

        public IActionResult Index()
        {
            return View();
        }
    }
}
