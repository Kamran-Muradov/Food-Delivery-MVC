using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Sliders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class SliderController : BaseController
    {
        public SliderController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/slider/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<SliderVM> model = JsonConvert.DeserializeObject<PaginationResponse<SliderVM>>(data);

            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = "RequireSuperAdminRole")]
        public async Task<IActionResult> Create([FromForm] SliderCreateVM request)
        {
            if (request == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Title), "Title");
            form.Add(new StringContent(request.Description), "Description");

            var streamContent = new StreamContent(request.Image.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Image.ContentType);
            form.Add(streamContent, "Image", request.Image.FileName);

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/Slider/create", form);
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromForm] SliderEditVM request)
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

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/Slider/edit/{id}", form);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/Slider/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            if (responseMessage.StatusCode == HttpStatusCode.BadRequest) return BadRequest();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPaginatedData([FromQuery] int page = 1, [FromQuery] int take = 5)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Slider/GetPaginateDatas?page={page}&take={take}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<SliderVM> model = JsonConvert.DeserializeObject<PaginationResponse<SliderVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Slider/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            SliderDetailVM model = JsonConvert.DeserializeObject<SliderDetailVM>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetImage([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/SliderImage/getBySliderId/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            SliderImageVM model = JsonConvert.DeserializeObject<SliderImageVM>(data);
            return Ok(model);
        }
    }
}
