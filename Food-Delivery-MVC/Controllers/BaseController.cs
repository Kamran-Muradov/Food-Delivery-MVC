using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Controllers
{
    public abstract class BaseController : Controller
    {
        protected readonly Uri BaseUri = new("https://localhost:7247/api/");
        protected readonly HttpClient HttpClient;

        protected BaseController(HttpClient httpClient)
        {
            HttpClient = httpClient;
            HttpClient.BaseAddress = BaseUri;
        }
    }
}
