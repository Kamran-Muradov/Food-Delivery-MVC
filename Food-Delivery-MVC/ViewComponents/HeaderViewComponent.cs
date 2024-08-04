using Food_Delivery_MVC.ViewModels.UI.Basket;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.ViewComponents
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
            List<BasketVM> basketDatas = Request.Cookies["basket"] is not null ? JsonConvert.DeserializeObject<List<BasketVM>>(Request.Cookies["basket"]) : new List<BasketVM>();

            return await Task.FromResult(View(new HeaderVMVC { BasketCount = basketDatas.Sum(bi => bi.Count) }));
        }
    }

    public class HeaderVMVC
    {
        public int BasketCount { get; set; }
    }
}
