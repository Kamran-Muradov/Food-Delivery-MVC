using System.Net;
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
        public PaymentController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
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

            var comments = Request.Form["checkoutComments"];
            var address = Request.Form["address"];
            HttpContext.Session.SetString("checkoutComments", comments);
            HttpContext.Session.SetString("address", address);

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("payment/createCheckoutSession", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<PaymentResponse>(responseData);

            return Redirect(response.SessionUrl);
        }

        [HttpGet]
        public async Task<IActionResult> PaymentSuccess([FromQuery] string sessionId)
        {
            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"payment/checkPaymentStatus?sessionId={sessionId}");
            if (responseMessage.StatusCode != HttpStatusCode.OK)
            {
                return RedirectToAction(nameof(PaymentCancel));
            }

            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;
            var comments = HttpContext.Session.GetString("checkoutComments")?.Trim();
            var address = HttpContext.Session.GetString("address")?.Trim();

            string data = JsonConvert.SerializeObject(new { userId, comments, address });

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            responseMessage = await HttpClient.PostAsync("checkout/create", content);
            responseMessage.EnsureSuccessStatusCode();

            HttpContext.Session.Remove("checkoutComments");
            HttpContext.Session.Remove("address");

            return View();
        }

        [HttpGet]
        public IActionResult PaymentCancel()
        {
            return View();
        }
    }
}
