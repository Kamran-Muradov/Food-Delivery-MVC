﻿using Food_Delivery_MVC.ViewModels.UI.Basket;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace Food_Delivery_MVC.ViewComponents
{
    public class HeaderViewComponent : ViewComponent
    {
        private readonly HttpClient _httpClient;

        public HeaderViewComponent(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("MyApiClient");
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            List<BasketVM> basketItems;
            string userId = null;
            if (UserClaimsPrincipal.Identity.IsAuthenticated)
            {
                userId = UserClaimsPrincipal.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value;
                basketItems = (List<BasketVM>)await _httpClient.GetFromJsonAsync<IEnumerable<BasketVM>>($"basketItem/getAllByUserId?userId={userId}");
            }
            else
            {
                basketItems = Request.Cookies["basket"] is not null ? JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]) : new List<BasketVM>();
            }

            var settings = await _httpClient.GetFromJsonAsync<Dictionary<string, string>>("setting/getAll");

            string profilePic = Request.Cookies["ProfilePic"];
            ViewBag.ProfilePic = profilePic;

            return await Task.FromResult(View(new HeaderVMVC
            {
                BasketCount = basketItems.Sum(bi => bi.Count),
                UserId = userId,
                Settings = settings
            }));
        }
    }

    public class HeaderVMVC
    {
        public int BasketCount { get; set; }
        public string UserId { get; set; }
        public Dictionary<string, string> Settings { get; set; }
    }
}
