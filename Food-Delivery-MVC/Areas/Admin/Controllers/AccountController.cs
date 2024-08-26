using System.Net;
using System.Text;
using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    [Authorize(Policy = "RequireSuperAdminRole")]
    public class AccountController : BaseController
    {
        public AccountController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/account/GetUsersPaginate?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<UserVM> model = JsonConvert.DeserializeObject<PaginationResponse<UserVM>>(data);

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> AddRoleToUser([FromQuery] string userId, [FromBody] UserEditVM request)
        {
            if (request == null || userId == null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);
            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync($"admin/account/AddRoleToUser?userId={userId}", content);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersPaginate([FromQuery] int page = 1, [FromQuery] int take = 5, [FromQuery] string? searchText = null)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Account/getUsersPaginate?page={page}&take={take}&searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<UserVM> model = JsonConvert.DeserializeObject<PaginationResponse<UserVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles([FromQuery] string userId)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/account/getRoles?userId={userId}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<UserRoleVM> model = JsonConvert.DeserializeObject<IEnumerable<UserRoleVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserDetail([FromQuery] string userId)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/account/getUserDetail?userId={userId}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            UserDetailVM model = JsonConvert.DeserializeObject<UserDetailVM>(data);

            return Ok(model);
        }
    }
}
