using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Contacts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class ContactController : BaseController
    {
        public ContactController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/contact/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<ContactVM> model = JsonConvert.DeserializeObject<PaginationResponse<ContactVM>>(data);

            return View(model);
        }
    }
}
