using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.ViewComponents
{
    public class PromoCodeViewComponent : ViewComponent
    {
        private readonly HttpClient _httpClient;

        public PromoCodeViewComponent(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("MyApiClient");
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            HttpResponseMessage responseMessage = await _httpClient.GetAsync("promoCode/getAllActive");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            IEnumerable<PromoCodeVMVC> model = JsonConvert.DeserializeObject<IEnumerable<PromoCodeVMVC>>(data);

            return await Task.FromResult(View(model));
        }
    }

    public class PromoCodeVMVC
    {
        public string Code { get; set; }
        public decimal Discount { get; set; }
    }
}
