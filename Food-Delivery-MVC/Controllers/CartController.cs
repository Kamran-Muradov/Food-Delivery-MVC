using System.Net;
using System.Security.Claims;
using System.Text;
using Food_Delivery_MVC.ViewModels.UI.Basket;
using Food_Delivery_MVC.ViewModels.UI.Menus;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class CartController : BaseController
    {
        public CartController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            List<BasketDetailVM> model = new();

            if (User.Identity.IsAuthenticated)
            {
                string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

                model = (List<BasketDetailVM>)await HttpClient.GetFromJsonAsync<IEnumerable<BasketDetailVM>>($"basketItem/getAllByUserId?userId={userId}");

                ViewBag.TotalPrice = model.Sum(m => m.Price);

                return View(model);
            }

            List<BasketVM> basketItems =
                HttpContext.Request.Cookies["basket"] is not null ? JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]) : new List<BasketVM>();


            foreach (var item in basketItems)
            {

                var menu = await HttpClient.GetFromJsonAsync<MenuDetailVM>($"menu/getById/{item.MenuId}");

                model.Add(new BasketDetailVM
                {
                    MenuId = item.MenuId,
                    Count = item.Count,
                    BasketVariants = item.BasketVariants,
                    Price = item.Price,
                    Name = menu.Name,
                    Image = menu.Image,
                    Restaurant = menu.Restaurant
                });
            }

            ViewBag.TotalPrice = model.Sum(m => m.Price);

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> ChangeMenuCount(int? menuId, int? count)
        {
            if (menuId == null || count == null) return BadRequest();

            List<BasketVM> basketItems;
            BasketVM basketItem;

            if (User.Identity.IsAuthenticated)
            {
                string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;
                string data = JsonConvert.SerializeObject(new
                {
                    UserId = userId,
                    MenuId = menuId,
                    Count = count
                });

                StringContent content = new(data, Encoding.UTF8, "application/json");

                HttpResponseMessage responseMessage = await HttpClient.PutAsync("basketItem/changeCount", content);

                responseMessage.EnsureSuccessStatusCode();

                basketItems = (List<BasketVM>)await HttpClient.GetFromJsonAsync<IEnumerable<BasketVM>>($"basketItem/getAllByUserId?userId={userId}");

                basketItem = basketItems.FirstOrDefault(bi => bi.MenuId == menuId);
                if (basketItem == null) return NotFound();
            }
            else
            {
                if (HttpContext.Request.Cookies["basket"] is not null)
                {
                    basketItems = JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]);
                }
                else
                {
                    return BadRequest();
                }

                basketItem = basketItems.FirstOrDefault(bi => bi.MenuId == menuId);

                if (basketItem == null) return NotFound();

                var singlePrice = basketItem.Price / basketItem.Count;

                basketItem.Count = (int)count;
                basketItem.Price = (decimal)(singlePrice * count);

                Response.Cookies.Delete("basket");

                Response.Cookies.Append("basket", JsonConvert.SerializeObject(basketItems));
            }

            return Ok(new
            {
                NewPrice = basketItem.Price,
                TotalPrice = basketItems.Sum(bi => bi.Price),
                BasketCount = basketItems.Sum(bi => bi.Count)
            });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteMenuFromBasket(int? menuId)
        {
            if (menuId == null) return BadRequest();

            List<BasketVM> basketItems;

            if (User.Identity.IsAuthenticated)
            {
                string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

                HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"basketItem/delete?userId={userId}&menuId={menuId}");
                responseMessage.EnsureSuccessStatusCode();

                basketItems = (List<BasketVM>)await HttpClient.GetFromJsonAsync<IEnumerable<BasketVM>>($"basketItem/getAllByUserId?userId={userId}");

            }
            else
            {
                if (HttpContext.Request.Cookies["basket"] is not null)
                {
                    basketItems = JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]);
                }
                else
                {
                    return BadRequest();
                }

                var basketItem = basketItems.FirstOrDefault(bi => bi.MenuId == menuId);

                if (basketItem == null) return NotFound();

                Response.Cookies.Delete("basket");
                basketItems.Remove(basketItem);

                if (basketItems.Count > 0)
                {
                    Response.Cookies.Append("basket", JsonConvert.SerializeObject(basketItems));
                }
            }

            return Ok(new { TotalPrice = basketItems.Sum(bi => bi.Price), BasketCount = basketItems.Sum(bi => bi.Count) });
        }

        [HttpPost]
        public async Task<IActionResult> Reset([FromBody] BasketCreateVM request)
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

                responseMessage = await HttpClient.PostAsync("basketItem/reset", content);

                responseMessage.EnsureSuccessStatusCode();

                basketItems = (List<BasketVM>)await HttpClient.GetFromJsonAsync<IEnumerable<BasketVM>>($"basketItem/getAllByUserId?userId={userId}");
            }
            else
            {
                basketItems = new List<BasketVM>();

                Response.Cookies.Delete("basket");
                basketItems.Add(new BasketVM
                {
                    Count = request.Count,
                    MenuId = request.MenuId,
                    RestaurantId = request.RestaurantId,
                    Price = request.Price,
                    BasketVariants = request.BasketVariants
                });

                Response.Cookies.Append("basket", JsonConvert.SerializeObject(basketItems));
            }

            return Ok(new { basketCount = basketItems.Sum(bi => bi.Count) });
        }
    }
}
