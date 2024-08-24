using System.Globalization;
using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Menus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class MenuController : BaseController
    {
        public MenuController(HttpClient httpClient) : base(httpClient) { }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/menu/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<MenuVM> model = JsonConvert.DeserializeObject<PaginationResponse<MenuVM>>(data);

            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = "RequireSuperAdminRole")]
        public async Task<IActionResult> Create([FromForm] MenuCreateVM request)
        {
            if (request == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Name), "name");
            form.Add(new StringContent(request.Price.ToString(CultureInfo.InvariantCulture)), "price");
            form.Add(new StringContent(request.CategoryId.ToString()), "categoryId");
            form.Add(new StringContent(request.RestaurantId.ToString()), "restaurantId");

            foreach (var ingredientId in request.IngredientIds)
            {
                form.Add(new StringContent(ingredientId.ToString()), "ingredientIds");
            }

            var streamContent = new StreamContent(request.Image.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Image.ContentType);
            form.Add(streamContent, "Image", request.Image.FileName);

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/Menu/create", form);
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromForm] MenuEditVM request)
        {
            if (request == null || id == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Name), "name");
            form.Add(new StringContent(request.Price.ToString(CultureInfo.InvariantCulture)), "price");
            form.Add(new StringContent(request.CategoryId.ToString()), "categoryId");
            form.Add(new StringContent(request.RestaurantId.ToString()), "restaurantId");

            foreach (var ingredientId in request.IngredientIds)
            {
                form.Add(new StringContent(ingredientId.ToString()), "ingredientIds");
            }

            if (request.Image is not null)
            {
                var streamContent = new StreamContent(request.Image.OpenReadStream());
                streamContent.Headers.ContentType = new MediaTypeHeaderValue(request.Image.ContentType);
                form.Add(streamContent, "Image", request.Image.FileName);
            }

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/Menu/edit/{id}", form);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/Menu/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPaginatedData([FromQuery] int page = 1, [FromQuery] int take = 5, [FromQuery] string? searchText = null)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Menu/GetPaginateDatas?page={page}&take={take}&searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<MenuVM> model = JsonConvert.DeserializeObject<PaginationResponse<MenuVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Menu/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            MenuDetailVM model = JsonConvert.DeserializeObject<MenuDetailVM>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllForSelect([FromQuery] int? excludeId)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Menu/GetAllForSelect?excludeId={excludeId}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<MenuSelectVM> model = JsonConvert.DeserializeObject<IEnumerable<MenuSelectVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetImage([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/MenuImage/getByMenuId/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            MenuImageVM model = JsonConvert.DeserializeObject<MenuImageVM>(data);
            return Ok(model);
        }
    }
}
