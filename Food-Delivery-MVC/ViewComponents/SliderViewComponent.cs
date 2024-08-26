using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.ViewComponents
{
    public class SliderViewComponent : ViewComponent
    {
        private readonly HttpClient _httpClient;

        public SliderViewComponent(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("MyApiClient");
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            HttpResponseMessage response = await _httpClient.GetAsync("slider/getAll");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<SliderVMVC> model = JsonConvert.DeserializeObject<IEnumerable<SliderVMVC>>(data);

            return await Task.FromResult(View(model));
        }
    }

    public class SliderVMVC
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
    }
}
