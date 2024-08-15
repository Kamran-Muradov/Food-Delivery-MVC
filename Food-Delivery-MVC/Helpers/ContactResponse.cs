using Food_Delivery_MVC.ViewModels.UI.SocialMedias;

namespace Food_Delivery_MVC.Helpers
{
    public class ContactResponse
    {
        public Dictionary<string,string> Settings { get; set; }
        public IEnumerable<SocialMediaVM> SocialMedias { get; set; }
    }
}
