using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Food_Delivery_MVC.ViewComponents
{
    public class TagViewComponent : ViewComponent
    {
        private readonly HttpClient _httpClient;

        public TagViewComponent(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("MyApiClient");
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            HttpResponseMessage response = await _httpClient.GetAsync("tag/getAll");

            response.EnsureSuccessStatusCode();

            string data = await response.Content.ReadAsStringAsync();

            IEnumerable<TagVMVC> model = JsonConvert.DeserializeObject<IEnumerable<TagVMVC>>(data);

            return await Task.FromResult(View(model));
        }
    }
    
    public class TagVMVC
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
    }
}
