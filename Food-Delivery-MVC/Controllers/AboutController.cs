using Food_Delivery_MVC.ViewModels.UI.Abouts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class AboutController : BaseController
    {
        public AboutController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("about/getAll");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<AboutVM> model = JsonConvert.DeserializeObject<IEnumerable<AboutVM>>(data);

            return View(model.ToList());
        }

      
    }
}
