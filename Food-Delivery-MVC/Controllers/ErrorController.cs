using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Controllers
{
    public class ErrorController : Controller
    {
        [Route("Error/{statusCode:int}")]
        public IActionResult HandleError(int statusCode)
        {
            switch (statusCode)
            {
                case 404:
                    return View("NotFound");
                case 400:
                    return View("BadRequest");
                case 401:
                case 403:
                    return View("Unauthorized");
                case 500:
                    return View("InternalServerError");
                default:
                    return View("InternalServerError"); // Handle unexpected errors
            }
        }
    }
}
