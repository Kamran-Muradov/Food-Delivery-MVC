using Food_Delivery_MVC.Helpers.Account;
using Food_Delivery_MVC.ViewModels.Account;
using Food_Delivery_MVC.ViewModels.UI.Checkouts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Food_Delivery_MVC.Helpers.Constants;
using Food_Delivery_MVC.ViewModels.UI.Favourites;

namespace Food_Delivery_MVC.Controllers
{
    [Authorize]
    public class UserProfileController : BaseController
    {
        public UserProfileController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"account/getUserById?userId={userId}");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();
            var model = JsonConvert.DeserializeObject<UserVM>(data);
            if (model.ProfilePicture == DefaultProfilePic.Url)
            {
                model.IsPictureDefault = true;
            }

            return View(model);
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

            var model = JsonConvert.DeserializeObject<UserVM>(data);
            if (model.ProfilePicture == DefaultProfilePic.Url)
            {
                model.IsPictureDefault = true;
            }

            return PartialView("_ProfileInfo", model);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(UserVM request)
        {
            if (request is null) return BadRequest();

            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            string data = JsonConvert.SerializeObject(new
            {
                UserName = request.UserName.Trim(),
                FullName = request.FullName.Trim(),
            });

            StringContent content = new(data, Encoding.UTF8, "application/json");

            string authToken = Request.Cookies["JWTToken"];

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            HttpResponseMessage responseMessage =
                await HttpClient.PostAsync($"account/editUser?userId={userId}", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<EditResponse>(responseData);

            if (!response.Success)
            {
                foreach (var error in response.Errors)
                {
                    ModelState.AddModelError(string.Empty, error);
                }
            }
            else
            {
                Response.Cookies.Delete("JWTToken");
                Response.Cookies.Append("JWTToken", response.Token);
            }

            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> EditPassword([FromBody] PasswordEditVM request)
        {
            if (request is null) return BadRequest();

            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            string data = JsonConvert.SerializeObject(new
            {
                CurrentPassword = request.CurrentPassword.Trim(),
                NewPassword = request.NewPassword.Trim(),
            });

            StringContent content = new(data, Encoding.UTF8, "application/json");

            string authToken = Request.Cookies["JWTToken"];

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            HttpResponseMessage responseMessage =
                await HttpClient.PostAsync($"account/editPassword?userId={userId}", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<EditResponse>(responseData);

            if (response.Success)
            {
                Response.Cookies.Delete("JWTToken");
                Response.Cookies.Append("JWTToken", response.Token);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> UploadProfilePicture(string userId, IFormFile profilePicture)
        {
            if (profilePicture is null || userId is null) return BadRequest();

            if (profilePicture.Length / 1024 > 2048) return Conflict(new { Message = "File size cannot exceed 2Mb" });
            if (!profilePicture.ContentType.Contains("image/")) return Conflict(new { Message = "File must be image type" });

            using var form = new MultipartFormDataContent();

            var streamContent = new StreamContent(profilePicture.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(profilePicture.ContentType);
            form.Add(streamContent, "ProfilePicture", profilePicture.FileName);

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);
            HttpResponseMessage responseMessage = await HttpClient.PostAsync($"account/editProfilePicture?userId={userId}", form);
            responseMessage.EnsureSuccessStatusCode();
            string responseData = await responseMessage.Content.ReadAsStringAsync();

            var model = JsonConvert.DeserializeObject<UserImageVM>(responseData);

            Response.Cookies.Delete("ProfilePic");

            Response.Cookies.Append("ProfilePic", model.Url, new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(30),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax
            });

            return Ok(model);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProfilePicture([FromQuery] string userId)
        {
            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);
            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"account/deleteProfilePicture?userId={userId}");
            responseMessage.EnsureSuccessStatusCode();
            string responseData = await responseMessage.Content.ReadAsStringAsync();

            var model = JsonConvert.DeserializeObject<UserImageVM>(responseData);

            Response.Cookies.Delete("ProfilePic");

            Response.Cookies.Append("ProfilePic", model.Url, new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(30),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax
            });

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFavourites()
        {
            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"favourite/getAllByUserId?userId={userId}");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            return PartialView("_Favourites", JsonConvert.DeserializeObject<IEnumerable<FavouriteVM>>(data));
        }
    }
}
