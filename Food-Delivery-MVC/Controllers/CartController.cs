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
            List<BasketVM> basketDatas;

            if (HttpContext.Request.Cookies["basket"] is not null)
            {
                basketDatas = JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]);
            }
            else
            {
                basketDatas = new List<BasketVM>();
            }

            List<BasketDetailVM> model = new();

            foreach (var item in basketDatas)
            {

                var menu = await HttpClient.GetFromJsonAsync<MenuDetailVM>($"menu/getById/{item.Id}");

                model.Add(new BasketDetailVM
                {
                    Id = item.Id,
                    Count = item.Count,
                    MenuVariants = item.MenuVariants,
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
        public IActionResult ChangeMenuCount(int? id, int? count)
        {
            if (id == null || count == null) return BadRequest();

            List<BasketVM> basketDatas;

            if (HttpContext.Request.Cookies["basket"] is not null)
            {
                basketDatas = JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]);
            }
            else
            {
                return BadRequest();
            }

            var basketItem = basketDatas.FirstOrDefault(bi => bi.Id == id);

            if (basketItem == null) return NotFound();

            var singlePrice = basketItem.Price / basketItem.Count;

            basketItem.Count = (int)count;
            basketItem.Price = (decimal)(singlePrice * count);

            Response.Cookies.Delete("basket");

            Response.Cookies.Append("basket", JsonConvert.SerializeObject(basketDatas));

            return Ok(new
            {
                NewPrice = basketItem.Price, 
                TotalPrice = basketDatas.Sum(bi => bi.Price),
                BasketCount = basketDatas.Sum(bi => bi.Count)
            });
        }

        [HttpPost]
        public IActionResult DeleteMenuFromBasket(int? id)
        {
            if (id == null) return BadRequest();

            List<BasketVM> basketDatas;

            if (HttpContext.Request.Cookies["basket"] is not null)
            {
                basketDatas = JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]);
            }
            else
            {
                return BadRequest();
            }

            var basketItem = basketDatas.FirstOrDefault(bi => bi.Id == id);

            if (basketItem == null) return NotFound();

            Response.Cookies.Delete("basket");
            basketDatas.Remove(basketItem);

            if (basketDatas.Count > 0)
            {
                Response.Cookies.Append("basket", JsonConvert.SerializeObject(basketDatas));
            }

            return Ok(new { TotalPrice = basketDatas.Sum(bi => bi.Price), BasketCount = basketDatas.Sum(bi => bi.Count) });
        }
    }
}
