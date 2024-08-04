using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net.Http.Headers;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Policy = "RequireAdminRole")]
    public abstract class BaseController : Controller
    {
        protected readonly Uri BaseUri = new("https://localhost:7247/api/");
        protected readonly HttpClient HttpClient;

        protected BaseController(HttpClient httpClient)
        {
            HttpClient = httpClient;
            HttpClient.BaseAddress = BaseUri;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var token = Request.Cookies["JWTToken"];
            if (token is not null)
            {
                HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }

            await base.OnActionExecutionAsync(context, next);
        }
    }
}
