using Food_Delivery_MVC.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;

namespace Food_Delivery_MVC.Controllers
{
    [Authorize]
    public class PaymentController : BaseController
    {
        public PaymentController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpPost]
        public async Task<IActionResult> CreateCheckoutSession()
        {
            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;
            string data = JsonConvert.SerializeObject(new
            {
                UserId = userId,
                SuccessUrl = Url.Action(nameof(PaymentSuccess), "Payment", values: null, protocol: Request.Scheme),
                CancelUrl = Url.Action(nameof(PaymentCancel), "Payment", values: null, protocol: Request.Scheme),
            });

            StringContent content = new(data, Encoding.UTF8, "application/json");

            string authToken = Request.Cookies["JWTToken"];

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("payment/createCheckoutSession", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<PaymentResponse>(responseData);

            return Redirect(response.SessionUrl);
        }

        [HttpGet]
        public async Task<IActionResult> PaymentSuccess([FromQuery] string sessionId)
        {
            string authToken = Request.Cookies["JWTToken"];

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"payment/checkPaymentStatus?sessionId={sessionId}");
            responseMessage.EnsureSuccessStatusCode();

            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;
            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            responseMessage = await HttpClient.PostAsync($"checkout/createByUserId?userId={userId}", null);
            responseMessage.EnsureSuccessStatusCode();

            return View();
        }

        [HttpGet]
        public IActionResult PaymentCancel()
        {
            return View();
        }
    }
}
