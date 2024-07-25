namespace Food_Delivery_MVC.Helpers
{
    public class PaginationResponse<T>
    {
        public IEnumerable<T> Datas { get; set; }
        public int TotalPage { get; set; }
        public int CurrentPage { get; set; }
    }
}
