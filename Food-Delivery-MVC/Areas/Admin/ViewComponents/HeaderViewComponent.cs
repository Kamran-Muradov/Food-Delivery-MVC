using Food_Delivery_MVC.ViewComponents;
using Food_Delivery_MVC.ViewModels.UI.Basket;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace Food_Delivery_MVC.Areas.Admin.ViewComponents
{
    public class HeaderViewComponent : ViewComponent
    {
        private readonly Uri _baseUri = new("https://localhost:7247/api/");
        private readonly HttpClient _httpClient;

        public HeaderViewComponent(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = _baseUri;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
       
            string profilePic = Request.Cookies["ProfilePic"];

            ViewBag.ProfilePic = profilePic;

            return await Task.FromResult(View());
        }
    }
}
