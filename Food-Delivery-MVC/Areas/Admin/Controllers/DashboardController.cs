using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    [Area("Admin")]
    //[Authorize(Policy = "RequireAdminRole")]
    public class DashboardController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        public DashboardController(HttpClient httpClient) : base(httpClient) { }
    }
}
