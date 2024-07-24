namespace Food_Delivery_MVC.Helpers.Extensions
{
    public static class FileExtension
    {
        public static string GenerateFilePath(this IWebHostEnvironment env, string folder, string fileName)
        {
            return Path.Combine(env.WebRootPath, folder, fileName);
        }

        public static async Task<string> ReadFromFileAsync(this string path)
        {
            using FileStream fs = new(path, FileMode.Open, FileAccess.Read);
            using StreamReader sr = new(fs);
            return await sr.ReadToEndAsync();
        }
    }
}
