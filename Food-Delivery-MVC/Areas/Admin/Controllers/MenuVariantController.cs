using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.MenuVariants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class MenuVariantController : BaseController
    {
        public MenuVariantController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/menuvariant/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<MenuVariantVM> model = JsonConvert.DeserializeObject<PaginationResponse<MenuVariantVM>>(data);

            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = "RequireSuperAdminRole")]
        public async Task<IActionResult> Create([FromBody] MenuVariantCreateVM request)
        {
            if (request == null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);
            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/MenuVariant/create", content);
            if (responseMessage.StatusCode == HttpStatusCode.Conflict) return Conflict();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromBody] MenuVariantEditVM request)
        {
            if (request == null || id == null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);
            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/MenuVariant/edit/{id}", content);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/MenuVariant/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPaginatedData([FromQuery] int page = 1, [FromQuery] int take = 5, [FromQuery] string? searchText = null)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/MenuVariant/GetPaginateDatas?page={page}&take={take}&searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<MenuVariantVM> model = JsonConvert.DeserializeObject<PaginationResponse<MenuVariantVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/MenuVariant/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            MenuVariantDetailVM model = JsonConvert.DeserializeObject<MenuVariantDetailVM>(data);

            return Ok(model);
        }
    }
}
