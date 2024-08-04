using System.Net;
using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.UI.Restaurants;
using Food_Delivery_MVC.ViewModels.UI.Tags;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Food_Delivery_MVC.ViewModels.UI.Basket;

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
            var tags = await HttpClient.GetFromJsonAsync<IEnumerable<TagVM>>("tag/getAll");

            string data = JsonConvert.SerializeObject(new RestaurantFilterVM());

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("restaurant/getLoadMore", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            PaginationResponse<RestaurantVM> restaurants = JsonConvert.DeserializeObject<PaginationResponse<RestaurantVM>>(responseData);

            return View(new RestaurantResponse { Tags = tags, Restaurants = restaurants });
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

        [HttpGet]
        public async Task<IActionResult> Detail(int? id)
        {
            if (id == null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"restaurant/getById/{id}");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            return View(JsonConvert.DeserializeObject<RestaurantDetailVM>(data));
        }

        [HttpPost]
        public async Task<IActionResult> AddMenuToBasket([FromBody] BasketVM request)
        {
            if (request == null) return BadRequest();
            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"menu/getById/{request.Id}");

            if (responseMessage.StatusCode == HttpStatusCode.NoContent)
            {
                return NotFound();
            }

            List<BasketVM> basketDatas;

            basketDatas = Request.Cookies["basket"] is not null ? JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]) : new List<BasketVM>();


            var existBasketData = basketDatas.FirstOrDefault(m => m.Id == request.Id);

            if (existBasketData is not null)
            {
                Response.Cookies.Delete("basket");
                basketDatas.Remove(existBasketData);
                basketDatas.Add(request);
            }
            else
            {
                basketDatas.Add(request);
            }

            Response.Cookies.Append("basket", JsonConvert.SerializeObject(basketDatas));

            return Ok(new { basketCount = basketDatas.Count });
        }
    }
}
