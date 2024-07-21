namespace Food_Delivery_MVC.ViewModels
{
    public class PaginationResponseVM<T>
    {
        public IEnumerable<T> Datas { get; set; }
        public int TotalPage { get; set; }
        public int CurrentPage { get; set; }
    }
}
