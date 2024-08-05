using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.UI.Menus;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.Controllers
{
    public class MenuController : BaseController
    {
        public MenuController(HttpClient httpClient) : base(httpClient)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Detail(int? menuId)
        {
            if (menuId is null) return BadRequest();

            HttpResponseMessage responseMessage = await HttpClient.GetAsync($"menu/getById/{menuId}");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            return PartialView("_Detail", JsonConvert.DeserializeObject<MenuDetailVM>(data));
        }
    }
}
