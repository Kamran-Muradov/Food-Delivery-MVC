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
        public AccountController(HttpClient httpClient) : base(httpClient)
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
    }
}
