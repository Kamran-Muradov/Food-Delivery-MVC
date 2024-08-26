using Microsoft.AspNetCore.Mvc;

namespace Food_Delivery_MVC.Areas.Admin.ViewComponents
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
       
            string profilePic = Request.Cookies["ProfilePic"];

            ViewBag.ProfilePic = profilePic;

            return await Task.FromResult(View());
        }
    }
}
