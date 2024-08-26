using Food_Delivery_MVC.ViewModels.UI.SocialMedias;
using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.ViewComponents
{
    public class FooterViewComponent : ViewComponent
    {
        private readonly HttpClient _httpClient;

        public FooterViewComponent(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("MyApiClient");
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var settings = await _httpClient.GetFromJsonAsync<Dictionary<string, string>>("setting/getAll");
            var socialMedias = await _httpClient.GetFromJsonAsync<IEnumerable<SocialMediaVM>>("socialMedia/getAll");

            return await Task.FromResult(View(new FooterVMVC
            {
                Settings = settings,
                SocialMedias = socialMedias
            }));
        }
    }

    public class FooterVMVC
    {
        public Dictionary<string, string> Settings { get; set; }
        public IEnumerable<SocialMediaVM> SocialMedias { get; set; }
    }
}
