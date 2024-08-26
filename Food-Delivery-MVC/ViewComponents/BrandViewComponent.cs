using Food_Delivery_MVC.ViewModels.UI.Brands;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.ViewComponents
{
    public class BrandViewComponent : ViewComponent
    {
        private readonly HttpClient _httpClient;

        public BrandViewComponent(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("MyApiClient");
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            HttpResponseMessage responseMessage = await _httpClient.GetAsync("brand/getAll");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            IEnumerable<BrandVM> model = JsonConvert.DeserializeObject<IEnumerable<BrandVM>>(data);

            return await Task.FromResult(View(model));
        }
    }
}
