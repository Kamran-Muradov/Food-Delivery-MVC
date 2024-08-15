using Food_Delivery_MVC.ViewModels.Admin.SocialMedias;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class SocialMediaController : BaseController
    {
        public SocialMediaController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/socialMedia/getAll");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<SocialMediaVM> model = JsonConvert.DeserializeObject<IEnumerable<SocialMediaVM>>(data);

            return View(model);
        }
    }
}
