using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace Food_Delivery_MVC.Controllers
{
    [Authorize]
    public class FavouriteController : BaseController
    {
        public FavouriteController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromQuery] int? restaurantId)
        {
            if (restaurantId == null) return BadRequest();

            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            string data = JsonConvert.SerializeObject(new { userId, restaurantId });

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("favourite/Create", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            int favouriteId = JsonConvert.DeserializeObject<int>(responseData);

            return Ok(favouriteId);
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromQuery] int? restaurantId)
        {
            if (restaurantId == null) return BadRequest();

            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);
            HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"favourite/delete?userId={userId}&restaurantId={restaurantId}");
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }
    }
}
