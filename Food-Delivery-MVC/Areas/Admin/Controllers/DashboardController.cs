using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class DashboardController : BaseController
    {
        public DashboardController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

        public IActionResult Index()
        {
            return View();
        }
    }
}
