using Food_Delivery_MVC.ViewModels.Admin.SocialMedias;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class SocialMediaController : BaseController
    {
        public SocialMediaController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/socialMedia/getAll");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<SocialMediaVM> model = JsonConvert.DeserializeObject<IEnumerable<SocialMediaVM>>(data);

            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = "RequireSuperAdminRole")]
        public async Task<IActionResult> Create([FromBody] SocialMediaEditVM request)
        {
            if (request == null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);
            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/SocialMedia/create", content);
            if (responseMessage.StatusCode == HttpStatusCode.Conflict) return Conflict();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromBody] SocialMediaEditVM request)
        {
            if (request == null || id == null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);
            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/socialMedia/edit/{id}", content);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            if (responseMessage.StatusCode == HttpStatusCode.Conflict) return Conflict();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/socialMedia/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            if (responseMessage.StatusCode == HttpStatusCode.BadRequest) return BadRequest();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/socialMedia/getAll");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<SocialMediaVM> model = JsonConvert.DeserializeObject<IEnumerable<SocialMediaVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/socialMedia/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            SocialMediaVM model = JsonConvert.DeserializeObject<SocialMediaVM>(data);

            return Ok(model);
        }
    }
}
