using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Abouts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class AboutController : BaseController
    {
        public AboutController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/about/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<AboutVM> model = JsonConvert.DeserializeObject<PaginationResponse<AboutVM>>(data);

            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = "RequireSuperAdminRole")]
        public async Task<IActionResult> Create([FromForm] AboutCreateVM request)
        {
            if (request == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Title), "Title");
            form.Add(new StringContent(request.Description), "Description");

            var streamContent = new StreamContent(request.Image.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Image.ContentType);
            form.Add(streamContent, "Image", request.Image.FileName);

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/About/create", form);
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromForm] AboutEditVM request)
        {
            if (request == null || id == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Title), "Title");
            form.Add(new StringContent(request.Description), "Description");

            if (request.Image is not null)
            {
                var streamContent = new StreamContent(request.Image.OpenReadStream());
                streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Image.ContentType);
                form.Add(streamContent, "Image", request.Image.FileName);
            }

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/About/edit/{id}", form);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/About/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPaginatedData([FromQuery] int page = 1, [FromQuery] int take = 5)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/About/GetPaginateDatas?page={page}&take={take}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<AboutVM> model = JsonConvert.DeserializeObject<PaginationResponse<AboutVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/About/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            AboutDetailVM model = JsonConvert.DeserializeObject<AboutDetailVM>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetImage([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/AboutImage/getByAboutId/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            AboutImageVM model = JsonConvert.DeserializeObject<AboutImageVM>(data);
            return Ok(model);
        }
    }
}
