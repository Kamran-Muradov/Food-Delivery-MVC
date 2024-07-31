using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.UI.Categories;
using Food_Delivery_MVC.ViewModels.UI.Restaurants;
using MailKit.Search;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Text;

namespace Food_Delivery_MVC.Controllers
{
    public class RestaurantController : BaseController
    {
        public RestaurantController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var categories = await HttpClient.GetFromJsonAsync<IEnumerable<CategoryVM>>("category/getAll");

            string data = JsonConvert.SerializeObject(new RestaurantFilterVM());

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("restaurant/getLoadMore", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            PaginationResponse<RestaurantVM> restaurants = JsonConvert.DeserializeObject<PaginationResponse<RestaurantVM>>(responseData);

            return View(new RestaurantResponse { Categories = categories, Restaurants = restaurants });
        }


        [HttpPost]
        public async Task<IActionResult> LoadMore([FromBody] RestaurantFilterVM request)
        {
            if (request is null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("restaurant/getLoadMore", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            PaginationResponse<RestaurantVM> restaurants = JsonConvert.DeserializeObject<PaginationResponse<RestaurantVM>>(responseData);

            Console.WriteLine(restaurants.TotalPage);

            return PartialView("_FilterResult", new RestaurantResponse { Restaurants = restaurants });
        }

        [HttpGet]
        public async Task<IActionResult> Search(string searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText)) return BadRequest();

            HttpResponseMessage response = await HttpClient.GetAsync($"restaurant/search?searchText={searchText}");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<RestaurantVM> model = JsonConvert.DeserializeObject<IEnumerable<RestaurantVM>>(data);

            return View(model);
        }
    }
}
