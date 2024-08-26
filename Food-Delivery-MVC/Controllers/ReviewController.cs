using Food_Delivery_MVC.ViewModels.UI.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace Food_Delivery_MVC.Controllers
{
    [Authorize]
    public class ReviewController : BaseController
    {
        public ReviewController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ReviewCreateVM request)
        {
            string data = JsonConvert.SerializeObject(request);

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("review/create", content);

            responseMessage.EnsureSuccessStatusCode();
            return Ok();
        }
    }
}
