using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class CategoryController : BaseController
    {
        public CategoryController(HttpClient httpClient) : base(httpClient) { }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/category/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<CategoryVM> model = JsonConvert.DeserializeObject<PaginationResponse<CategoryVM>>(data);

            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = "RequireSuperAdminRole")]
        public async Task<IActionResult> Create([FromForm] CategoryCreateVM request)
        {
            if (request == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Name), "name");

            var streamContent = new StreamContent(request.Image.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Image.ContentType);
            form.Add(streamContent, "Image", request.Image.FileName);

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/category/create", form);
            if (responseMessage.StatusCode == HttpStatusCode.Conflict) return Conflict();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromForm] CategoryEditVM request)
        {
            if (request == null || id == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Name), "name");

            if (request.Image is not null)
            {
                var streamContent = new StreamContent(request.Image.OpenReadStream());
                streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Image.ContentType);
                form.Add(streamContent, "Image", request.Image.FileName);
            }

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/category/edit/{id}", form);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            if (responseMessage.StatusCode == HttpStatusCode.Conflict) return Conflict();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/category/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPaginatedData([FromQuery] int page = 1, [FromQuery] int take = 5, [FromQuery] string? searchText = null)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/category/GetPaginateDatas?page={page}&take={take}&searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<CategoryVM> model = JsonConvert.DeserializeObject<PaginationResponse<CategoryVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/category/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            CategoryVM model = JsonConvert.DeserializeObject<CategoryVM>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllForSelect([FromQuery] int? excludeId)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/category/GetAllForSelect?excludeId={excludeId}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<CategorySelectVM> model = JsonConvert.DeserializeObject<IEnumerable<CategorySelectVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetImage([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/categoryImage/getByCategoryId/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            CategoryImageVM model = JsonConvert.DeserializeObject<CategoryImageVM>(data);
            return Ok(model);
        }
    }
}
