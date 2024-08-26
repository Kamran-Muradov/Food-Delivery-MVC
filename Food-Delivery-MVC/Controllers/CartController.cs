using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.UI.Basket;
using Food_Delivery_MVC.ViewModels.UI.Menus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;

namespace Food_Delivery_MVC.Controllers
{
    public class CartController : BaseController
    {
        public CartController(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
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

                ViewBag.TotalAmount = model.FirstOrDefault()?.DiscountPrice != null ? model.Sum(m => m.DiscountPrice) : model.Sum(m => m.Price);

                ViewBag.TotalPrice = ViewBag.TotalAmount + model.FirstOrDefault()?.DeliveryFee;

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
                    DiscountPrice = item.DiscountPrice,
                    Name = menu.Name,
                    Image = menu.Image,
                    DeliveryFee = item.DeliveryFee,
                    Restaurant = menu.Restaurant
                });
            }

            ViewBag.TotalAmount = (model.FirstOrDefault()?.DiscountPrice != null ? model.Sum(m => m.DiscountPrice) : model.Sum(m => m.Price)) ?? 0;

            ViewBag.TotalPrice = ViewBag.TotalAmount + model.FirstOrDefault()?.DeliveryFee;

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> ChangeMenuCount(int? menuId, int? count)
        {
            if (menuId == null || count == null) return BadRequest();

            List<BasketVM> basketItems;
            BasketVM basketItem;

            decimal? discountAmount;
            decimal? oldAmount;
            decimal? discountPrice;
            decimal? oldPrice;
            decimal newItemPrice;
            decimal? newItemDiscountPrice;
            int basketCount;

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

                discountAmount = basketItems.Sum(bi => bi.DiscountPrice);
                oldAmount = basketItems.Sum(bi => bi.Price);
                discountPrice = discountAmount + basketItems.FirstOrDefault()?.DeliveryFee;
                oldPrice = oldAmount + basketItems.FirstOrDefault()?.DeliveryFee;
                basketCount = basketItems.Sum(bi => bi.Count);
                newItemPrice = basketItem.Price;
                newItemDiscountPrice = basketItem.DiscountPrice;
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

                discountAmount = basketItems.Sum(bi => bi.DiscountPrice);
                oldAmount = basketItems.Sum(bi => bi.Price);
                discountPrice = discountAmount + basketItems.FirstOrDefault()?.DeliveryFee;
                oldPrice = oldAmount + basketItems.FirstOrDefault()?.DeliveryFee;
                basketCount = basketItems.Sum(bi => bi.Count);
                newItemPrice = basketItem.Price;
                newItemDiscountPrice = basketItem.DiscountPrice;
            }

            return Ok(new
            {
                discountAmount,
                oldAmount,
                basketCount,
                oldPrice,
                newItemPrice,
                discountPrice,
                newItemDiscountPrice
            });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteMenuFromBasket(int? menuId)
        {
            if (menuId == null) return BadRequest();

            List<BasketVM> basketItems;

            decimal? discountAmount;
            decimal? oldAmount;
            decimal? discountPrice;
            decimal? oldPrice;
            int basketCount;

            if (User.Identity.IsAuthenticated)
            {
                string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;

                HttpResponseMessage responseMessage = await HttpClient.DeleteAsync($"basketItem/delete?userId={userId}&menuId={menuId}");
                responseMessage.EnsureSuccessStatusCode();

                basketItems = (List<BasketVM>)await HttpClient.GetFromJsonAsync<IEnumerable<BasketVM>>($"basketItem/getAllByUserId?userId={userId}");

                discountAmount = basketItems.Sum(bi => bi.DiscountPrice);
                oldAmount = basketItems.Sum(bi => bi.Price);
                discountPrice = discountAmount + basketItems.FirstOrDefault()?.DeliveryFee;
                oldPrice = oldAmount + basketItems.FirstOrDefault()?.DeliveryFee;
                basketCount = basketItems.Sum(bi => bi.Count);

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

                discountAmount = basketItems.Sum(bi => bi.DiscountPrice);
                oldAmount = basketItems.Sum(bi => bi.Price);
                discountPrice = discountAmount + basketItems.FirstOrDefault()?.DeliveryFee;
                oldPrice = oldAmount + basketItems.FirstOrDefault()?.DeliveryFee;
                basketCount = basketItems.Sum(bi => bi.Count);
            }

            return Ok(new { discountAmount, discountPrice, oldAmount, oldPrice, basketCount });
        }

        [HttpPost]
        public async Task<IActionResult> Reset([FromBody] BasketCreateVM request)
        {
            if (request == null) return BadRequest();
            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"menu/getById/{request.MenuId}");

            if (responseMessage.StatusCode == HttpStatusCode.NotFound)
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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ApplyPromoCode([FromQuery] string code)
        {
            if (code == null) return BadRequest();

            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;
            string data = JsonConvert.SerializeObject(new { userId, code });
            StringContent content = new(data, Encoding.UTF8, "application/json");
            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            var responseMessage = await HttpClient.PostAsync("promoCode/applyToBasket", content);
            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<PromoCodeResponse>(responseData);

            if (!response.Success) return BadRequest(response);

            List<BasketVM> basketItems = (List<BasketVM>)await HttpClient.GetFromJsonAsync<IEnumerable<BasketVM>>($"basketItem/getAllByUserId?userId={userId}");

            var discountAmount = basketItems.Sum(bi => bi.DiscountPrice);
            var oldAmount = basketItems.Sum(bi => bi.Price);
            var discountPrice = discountAmount + basketItems.FirstOrDefault()?.DeliveryFee;
            var oldPrice = oldAmount + basketItems.FirstOrDefault()?.DeliveryFee;

            return Ok(new { discountAmount, discountPrice, oldAmount, oldPrice, response.Discount });
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteUserPromoCode()
        {
            string userId = User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;
            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Request.Cookies["JWTToken"]);

            var responseMessage = await HttpClient.DeleteAsync($"promoCode/deleteUserPromoCode?userId={userId}");
            responseMessage.EnsureSuccessStatusCode();

            return Ok();
        }
    }
}
