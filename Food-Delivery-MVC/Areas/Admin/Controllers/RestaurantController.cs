using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Restaurants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class RestaurantController : BaseController
    {
        public RestaurantController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }
        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/Restaurant/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<RestaurantVM> model = JsonConvert.DeserializeObject<PaginationResponse<RestaurantVM>>(data);

            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = "RequireSuperAdminRole")]
        public async Task<IActionResult> Create([FromForm] RestaurantCreateVM request)
        {
            if (request == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Name), "name");
            form.Add(new StringContent(request.Description), "description");
            form.Add(new StringContent(request.Phone), "phone");
            form.Add(new StringContent(request.Address), "address");
            form.Add(new StringContent(request.DeliveryFee.ToString()), "deliveryFee");
            form.Add(new StringContent(request.MinDeliveryTime.ToString()), "minDeliveryTime");
            form.Add(new StringContent(request.Email), "email");
            form.Add(new StringContent(request.BrandId.ToString()), "brandId");
            form.Add(new StringContent(request.CityId.ToString()), "cityId");

            if (request.Website is not null)
            {
                form.Add(new StringContent(request.Website), "website");
            }

            foreach (var tagId in request.TagIds)
            {
                form.Add(new StringContent(tagId.ToString()), "tagIds");
            }

            foreach (var image in request.Images)
            {
                var fileContent = new StreamContent(image.OpenReadStream());
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                form.Add(fileContent, "images", image.FileName);
            }

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/Restaurant/create", form);
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromRoute] int? id, [FromForm] RestaurantEditVM request)
        {
            if (request == null || id == null) return BadRequest();

            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(request.Name), "name");
            form.Add(new StringContent(request.Description), "description");
            form.Add(new StringContent(request.Phone), "phone");
            form.Add(new StringContent(request.Address), "address");
            form.Add(new StringContent(request.DeliveryFee.ToString(CultureInfo.InvariantCulture)), "deliveryFee");
            form.Add(new StringContent(request.MinDeliveryTime.ToString()), "minDeliveryTime");
            form.Add(new StringContent(request.Email), "email");
            form.Add(new StringContent(request.BrandId.ToString()), "brandId");
            form.Add(new StringContent(request.CityId.ToString()), "cityId");

            if (request.Website is not null)
            {
                form.Add(new StringContent(request.Website), "website");
            }

            foreach (var tagId in request.TagIds)
            {
                form.Add(new StringContent(tagId.ToString()), "tagIds");
            }

            if (request.Images is not null)
            {
                foreach (var image in request.Images)
                {
                    var fileContent = new StreamContent(image.OpenReadStream());
                    fileContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                    form.Add(fileContent, "images", image.FileName);
                }
            }

            HttpResponseMessage responseMessage = await HttpClient.PutAsync($"admin/Restaurant/edit/{id}", form);
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/Restaurant/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();
            if (responseMessage.StatusCode == HttpStatusCode.BadRequest) return BadRequest();
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPaginatedData([FromQuery] int page = 1, [FromQuery] int take = 5, [FromQuery] string? searchText = null)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Restaurant/GetPaginateDatas?page={page}&take={take}&searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<RestaurantVM> model = JsonConvert.DeserializeObject<PaginationResponse<RestaurantVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Restaurant/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            RestaurantDetailVM model = JsonConvert.DeserializeObject<RestaurantDetailVM>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllForSelect([FromQuery] int? excludeId)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/Restaurant/GetAllForSelect?excludeId={excludeId}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<RestaurantSelectVM> model = JsonConvert.DeserializeObject<IEnumerable<RestaurantSelectVM>>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllImages([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/RestaurantImage/getAllByRestaurantId/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();
            IEnumerable<RestaurantImageVM> model = JsonConvert.DeserializeObject<IEnumerable<RestaurantImageVM>>(data);

            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> SetMainImage([FromBody] MainAndDeleteImageVM request)
        {
            if (request == null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);
            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/restaurant/setMainImage", content);
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> DeleteImage([FromBody] MainAndDeleteImageVM request)
        {
            if (request == null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);
            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("admin/restaurant/deleteImage", content);
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }
    }
}
