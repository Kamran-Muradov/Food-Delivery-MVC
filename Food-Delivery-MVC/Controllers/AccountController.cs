using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.Helpers.Extensions;
using Food_Delivery_MVC.Services.Interfaces;
using Food_Delivery_MVC.ViewModels.Account;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace Food_Delivery_MVC.Controllers
{
    public class AccountController : Controller
    {
        private readonly Uri _baseUri = new("https://localhost:7247/api/");
        private readonly HttpClient _httpClient;
        private readonly IWebHostEnvironment _env;
        private readonly IEmailService _emailService;

        public AccountController(HttpClient httpClient,
                                 IWebHostEnvironment env,
                                 IEmailService emailService)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = _baseUri;
            _env = env;
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SignUp(RegisterVM request)
        {
            string data = JsonConvert.SerializeObject(request);

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMsg = await _httpClient.PostAsync("account/signup", content);

            responseMsg.EnsureSuccessStatusCode();

            string responseData = await responseMsg.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<RegisterResponse>(responseData);

            if (response.Errors is not null) return Ok(response);

            var url = Url.Action(nameof(ConfirmEmail), "Account", new { userId = response.UserId, token = response.ConfirmationToken }, Request.Scheme, Request.Host.ToString());

            string path = _env.GenerateFilePath("templates", "new-email.html");

            string html = await path.ReadFromFileAsync();

            string confirmHtml = html.Replace("verify-link", url);

            _emailService.Send(request.Email, "Email confirmation", confirmHtml);

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (userId is null || token is null) return BadRequest();
            token = token.Replace(" ", "+");

            string encodedToken = WebUtility.UrlEncode(token);

            HttpResponseMessage response = await _httpClient.GetAsync($"Account/ConfirmEmail?userid={userId}&token={encodedToken}");

            response.EnsureSuccessStatusCode();

            return RedirectToAction(nameof(VerifySuccess));
        }

        [HttpGet]
        public IActionResult VerifySuccess()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SignIn(LoginVM request)
        {
            string data = JsonConvert.SerializeObject(request);

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await _httpClient.PostAsync("account/signin", content);

            var responseContent = await responseMessage.Content.ReadAsStringAsync();
            LoginResponse response = JsonConvert.DeserializeObject<LoginResponse>(responseContent);

            if (!response.Success) return Ok(response);

            if (request.RememberMe)
            {
                var cookieOptions = new CookieOptions
                {
                    Expires = DateTime.UtcNow.AddDays(30),
                    IsEssential = true,
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict
                };

                Response.Cookies.Append("JWTToken", response.Token, cookieOptions);
            }
            else
            {
                Response.Cookies.Append("JWTToken", response.Token);

            }

            return Ok(response);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("JWTToken");

            return RedirectToAction("Index", "Home");
        }
    }
}
