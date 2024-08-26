using Food_Delivery_MVC.ViewModels.UI.Reviews;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.ViewComponents
{
    public class ReviewViewComponent : ViewComponent
    {
        private readonly HttpClient _httpClient;
        public ReviewViewComponent(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("MyApiClient");
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            HttpResponseMessage responseMessage = await _httpClient.GetAsync("review/getAll");

            responseMessage.EnsureSuccessStatusCode();

            string data = await responseMessage.Content.ReadAsStringAsync();

            IEnumerable<ReviewVM> model = JsonConvert.DeserializeObject<IEnumerable<ReviewVM>>(data);

            return await Task.FromResult(View(model));
        }
    }
}
