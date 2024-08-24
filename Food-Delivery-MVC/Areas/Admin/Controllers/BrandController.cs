using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Brands;
using Food_Delivery_MVC.ViewModels.Admin.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class BrandController : BaseController
    {
        public BrandController(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/brand/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<BrandVM> model = JsonConvert.DeserializeObject<PaginationResponse<BrandVM>>(data);

            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = "RequireSuperAdminRole")]
        public async Task<IActionResult> Create([FromForm] BrandCreateVM request)
        {
            if (request == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Name), "name");

            var streamContent = new StreamContent(request.Logo.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Logo.ContentType);
            form.Add(streamContent, "Logo", request.Logo.FileName);

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/Brand/create", form);
            if (responseMessage.StatusCode == HttpStatusCode.Conflict) return Conflict();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromForm] BrandEditVM request)
        {
            if (request == null || id == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Name), "name");

            if (request.Logo is not null)
            {
                var streamContent = new StreamContent(request.Logo.OpenReadStream());
                streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Logo.ContentType);
                form.Add(streamContent, "Logo", request.Logo.FileName);
            }

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/Brand/edit/{id}", form);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            if (responseMessage.StatusCode == HttpStatusCode.Conflict) return Conflict();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/Brand/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            if (responseMessage.StatusCode == HttpStatusCode.BadRequest) return BadRequest();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPaginatedData([FromQuery] int page = 1, [FromQuery] int take = 5)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Brand/GetPaginateDatas?page={page}&take={take}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<BrandVM> model = JsonConvert.DeserializeObject<PaginationResponse<BrandVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Brand/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            BrandVM model = JsonConvert.DeserializeObject<BrandVM>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllForSelect([FromQuery] int? excludeId)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Brand/GetAllForSelect?excludeId={excludeId}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<BrandSelectVM> model = JsonConvert.DeserializeObject<IEnumerable<BrandSelectVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetLogo([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/BrandLogo/getByBrandId/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            BrandLogoVM model = JsonConvert.DeserializeObject<BrandLogoVM>(data);
            return Ok(model);
        }
    }
}
