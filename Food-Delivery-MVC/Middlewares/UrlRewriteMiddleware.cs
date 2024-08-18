namespace Food_Delivery_MVC.Middlewares
{
    public class UrlRewriteMiddleware
    {
        private readonly RequestDelegate _next;

        public UrlRewriteMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value;

            if (path.StartsWith("/brands/", StringComparison.OrdinalIgnoreCase))
            {
                var segments = path.Split('/');
                if (segments.Length > 2)
                {
                    var nameSegment = segments[2];
                    var sanitizedName = nameSegment.Replace(' ', '_');
                    if (sanitizedName != nameSegment)
                    {
                        // Update the path with the sanitized name
                        segments[2] = sanitizedName;
                        context.Request.Path = string.Join('/', segments);
                    }
                }
            }

            await _next(context);
        }
    }

}
