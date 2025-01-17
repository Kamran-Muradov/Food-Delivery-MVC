﻿using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.ViewModels.UI.Restaurants;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace Food_Delivery_MVC.ViewComponents
{
    public class RestaurantViewComponent : ViewComponent
    {
        private readonly HttpClient _httpClient;

        public RestaurantViewComponent(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("MyApiClient");
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            string data = JsonConvert.SerializeObject(new RestaurantFilterVM { Sorting = "rating", Take = 12 });

            StringContent content = new(data, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await _httpClient.PostAsync("restaurant/getAllFiltered", content);
            responseMessage.EnsureSuccessStatusCode();

            string responseData = await responseMessage.Content.ReadAsStringAsync();
            PaginationResponse<RestaurantVMVC> model = JsonConvert.DeserializeObject<PaginationResponse<RestaurantVMVC>>(responseData);

            return await Task.FromResult(View(model));
        }


    }

    public class RestaurantVMVC
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double AverageRating { get; set; }
        public IEnumerable<RestaurantImageVM> RestaurantImages { get; set; }
    }
}
