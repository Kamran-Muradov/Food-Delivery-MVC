using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.ViewComponents
{
    public class CategoryViewComponent : ViewComponent
    {
        private readonly Uri _baseUri = new("https://localhost:7247/api/");
        private readonly HttpClient _httpClient;

        public CategoryViewComponent(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = _baseUri;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            HttpResponseMessage response = await _httpClient.GetAsync("category/getall");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<CategoryVMVC> model = JsonConvert.DeserializeObject<IEnumerable<CategoryVMVC>>(data);

            return await Task.FromResult(View(model));
        }
    }
    
    public class CategoryVMVC
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
    }
}
