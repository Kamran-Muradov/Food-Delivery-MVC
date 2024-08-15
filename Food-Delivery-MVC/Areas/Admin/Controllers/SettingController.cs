using Food_Delivery_MVC.ViewModels.Admin.Settings;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class SettingController : BaseController
    {
        public SettingController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/setting/getAll");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<SettingVM> model = JsonConvert.DeserializeObject<IEnumerable<SettingVM>>(data);

            return View(model);
        }
    }
}
