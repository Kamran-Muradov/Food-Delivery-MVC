using Food_Delivery_MVC.ViewModels.Admin.Settings;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class SettingController : BaseController
    {
        public SettingController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
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

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromBody] SettingEditVM request)
        {
            if (request == null || id == null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);
            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/setting/edit/{id}", content);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/setting/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            SettingVM model = JsonConvert.DeserializeObject<SettingVM>(data);

            return Ok(model);
        }
    }
}
