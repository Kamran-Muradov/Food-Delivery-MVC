using System.Net.Http.Headers;
using System.Security.Claims;
using Food_Delivery_MVC.ViewModels.Account;
using Food_Delivery_MVC.ViewModels.UI.Checkouts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class UserProfileController : BaseController
    {
        public UserProfileController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Index()
        {
            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"account/getUserById?userId={userId}");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            return View(JsonConvert.DeserializeObject<UserVM>(data));
        }

        [HttpGet]
        public async Task<IActionResult> Checkouts()
        {
            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            string authToken = Request.Cookies["JWTToken"];

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"checkout/getAllByUserId?userId={userId}");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            return PartialView("_Checkouts", JsonConvert.DeserializeObject<IEnumerable<CheckoutVM>>(data));
        }

        [HttpGet]
        public async Task<IActionResult> ProfileInfo()
        {
            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"account/getUserById?userId={userId}");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            return PartialView("_ProfileInfo", JsonConvert.DeserializeObject<UserVM>(data));
        }
    }
}
