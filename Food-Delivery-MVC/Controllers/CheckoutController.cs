using System.Net.Http.Headers;
using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.UI.Checkouts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class CheckoutController : BaseController
    {
        public CheckoutController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Detail([FromRoute] int id)
        {
            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"checkout/getById/{id}");

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            var model = JsonConvert.DeserializeObject<CheckoutDetailVM>(responseData);

            return PartialView("_Detail", model);
        }
    }
}
