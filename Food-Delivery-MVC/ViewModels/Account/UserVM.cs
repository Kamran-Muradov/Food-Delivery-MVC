﻿using Food_Delivery_MVC.Helpers.Constants;

namespace Food_Delivery_MVC.ViewModels.Account
{
    public class UserVM
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string ProfilePicture { get; set; }
        public bool IsPictureDefault { get; set; } = false;
    }
}
