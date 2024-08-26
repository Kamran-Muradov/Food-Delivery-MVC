using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Controllers
{
    public abstract class BaseController : Controller
    {
        protected readonly HttpClient HttpClient;

        protected BaseController(IHttpClientFactory httpClientFactory)
        {
            HttpClient = httpClientFactory.CreateClient("MyApiClient");
        }
    }
}
