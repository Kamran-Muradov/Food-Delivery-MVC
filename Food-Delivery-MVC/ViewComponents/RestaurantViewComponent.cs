using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.ViewComponents
{
    public class RestaurantViewComponent : ViewComponent
    {
        private readonly Uri _baseUri = new("https://localhost:7247/api/");
        private readonly HttpClient _httpClient;

        public RestaurantViewComponent(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = _baseUri;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            HttpResponseMessage response = await _httpClient.GetAsync("restaurant/getall");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<RestaurantVMVC> model = JsonConvert.DeserializeObject<IEnumerable<RestaurantVMVC>>(data);

            return await Task.FromResult(View(model));
        }

       
    }
    public class RestaurantVMVC
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MainImage { get; set; }
    }
}
