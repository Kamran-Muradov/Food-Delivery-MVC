using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.UI.Contacts;
using Food_Delivery_MVC.ViewModels.UI.SocialMedias;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace Food_Delivery_MVC.Controllers
{
    public class ContactController : BaseController
    {
        public ContactController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            ContactResponse model = new()
            {
                Settings = await HttpClient.GetFromJsonAsync<Dictionary<string, string>>("setting/getAll"),
                SocialMedias = await HttpClient.GetFromJsonAsync<IEnumerable<SocialMediaVM>>("socialMedia/getAll")
            };

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContactCreateVM request)
        {
            string data = JsonConvert.SerializeObject(request);

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("contact/create", content);

            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }
    }
}
