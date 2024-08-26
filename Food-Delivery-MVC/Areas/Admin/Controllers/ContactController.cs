using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.Admin.Contacts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;

namespace Food_Delivery_MVC.Areas.Admin.Controllers
{
    public class ContactController : BaseController
    {
        public ContactController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
        }

        public async Task<IActionResult> Index()
        {
            HttpResponseMessage response = await HttpClient.GetAsync("admin/contact/GetPaginateDatas?page=1&take=5");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<ContactVM> model = JsonConvert.DeserializeObject<PaginationResponse<ContactVM>>(data);

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/contact/GetById/{id}");
            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            ContactDetailVM model = JsonConvert.DeserializeObject<ContactDetailVM>(data);

            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetPaginatedData([FromQuery] int page = 1, [FromQuery] int take = 5)
        {
            HttpResponseMessage response = await HttpClient.GetAsync($"admin/contact/GetPaginateDatas?page={page}&take={take}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            PaginationResponse<ContactVM> model = JsonConvert.DeserializeObject<PaginationResponse<ContactVM>>(data);

            return Ok(model);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"admin/contact/delete?id={id}");
            if (responseMessage.StatusCode == HttpStatusCode.NotFound) return NotFound();

            return Ok();
        }
    }
}
