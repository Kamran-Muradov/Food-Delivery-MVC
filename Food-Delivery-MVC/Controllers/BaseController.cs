using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Food_Delivery_MVC.Controllers
{
    public class BaseController : Controller
    {
        protected readonly Uri BaseUri = new("https://localhost:7247/api/");
        protected readonly HttpClient HttpClient;

        public BaseController(HttpClient httpClient)
        {
            HttpClient = httpClient;
            HttpClient.BaseAddress = BaseUri;
        }
    }
}
