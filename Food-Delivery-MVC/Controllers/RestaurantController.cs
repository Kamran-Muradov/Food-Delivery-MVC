using System.Net;
using System.Security.Claims;
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

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("restaurant/getAllFiltered", content);

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            PaginationResponse<RestaurantVM> restaurants = JsonConvert.DeserializeObject<PaginationResponse<RestaurantVM>>(responseData);

            return View(new RestaurantResponse { Tags = tags, Restaurants = restaurants });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllByTagId(int tagId)
        {

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"restaurant/getAllByTagId?tagId={tagId}");

            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            return View(JsonConvert.DeserializeObject<IEnumerable<RestaurantVM>>(responseData));
        }

        [HttpPost]
        public async Task<IActionResult> LoadMore([FromBody] RestaurantFilterVM request)
        {
            if (request is null) return BadRequest();

            string data = JsonConvert.SerializeObject(request);

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await HttpClient.PostAsync("restaurant/getAllFiltered", content);

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
        public async Task<IActionResult> AddMenuToBasket([FromBody] BasketCreateVM request)
        {
            if (request == null) return BadRequest();
            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"menu/getById/{request.MenuId}");

            if (responseMessage.StatusCode == HttpStatusCode.NoContent)
            {
                return NotFound();
            }

            List<BasketVM> basketItems;

            if (User.Identity.IsAuthenticated)
            {
                string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;
                request.UserId = userId;

                string data = JsonConvert.SerializeObject(request);

                StringContent content = new(data, Encoding.UTF8, "application/json");

                responseMessage = await HttpClient.PostAsync("basketItem/create", content);

                if (responseMessage.StatusCode == HttpStatusCode.Conflict)
                {
                    return Conflict();
                }

                responseMessage.EnsureSuccessStatusCode();

                basketItems = (List<BasketVM>)await HttpClient.GetFromJsonAsync<IEnumerable<BasketVM>>($"basketItem/getAllByUserId?userId={userId}");

                return Ok(new { basketCount = basketItems.Sum(bi => bi.Count) });
            }

            basketItems = Request.Cookies["basket"] is not null ? JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]) : new List<BasketVM>();

            if (basketItems.Count > 0)
            {
                if (basketItems.First().RestaurantId != request.RestaurantId) return Conflict();
            }

            var existBasketItem = basketItems.FirstOrDefault(m => m.MenuId == request.MenuId);

            if (existBasketItem is not null)
            {
                Response.Cookies.Delete("basket");
                basketItems.Remove(existBasketItem);
                basketItems.Add(new BasketVM
                {
                    Count = request.Count,
                    MenuId = request.MenuId,
                    RestaurantId = request.RestaurantId,
                    Price = request.Price,
                    BasketVariants = request.BasketVariants
                });
            }
            else
            {
                basketItems.Add(new BasketVM
                {
                    Count = request.Count,
                    MenuId = request.MenuId,
                    RestaurantId = request.RestaurantId,
                    Price = request.Price,
                    BasketVariants = request.BasketVariants

                });
            }

            Response.Cookies.Append("basket", JsonConvert.SerializeObject(basketItems));

            return Ok(new { basketCount = basketItems.Sum(bi => bi.Count) });
        }
    }
}
