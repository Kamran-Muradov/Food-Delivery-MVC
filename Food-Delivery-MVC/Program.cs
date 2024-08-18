using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.Services;
using Food_Delivery_MVC.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Food_Delivery_MVC.Middlewares;

var builder = WebApplication.CreateBuilder(args);


builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.MinimumSameSitePolicy = SameSiteMode.Lax;
});

builder.Services.AddSession(options =>
{
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JWTSettings"));

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }) // End of last snippet
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["JWTSettings:Key"];
        var issuer = builder.Configuration["JWTSettings:Issuer"];

        options.Authority = issuer;
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.Configuration = new OpenIdConnectConfiguration();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = false,
            ValidateLifetime = true,
            RequireExpirationTime = true,
            ClockSkew = TimeSpan.Zero,
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["JWTToken"];
                context.Token = token;

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(o =>
{
    o.AddPolicy("RequireAdminRole", p => p.RequireRole("Admin"));
    o.AddPolicy("RequireSuperAdminRole", p => p.RequireRole("SuperAdmin"));
});
builder.Services.AddControllersWithViews();
builder.Services.AddHttpClient();

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Smtp"));

builder.Services.AddDistributedMemoryCache();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCookiePolicy();

app.Use(async (context, next) =>
{
    var token = context.Request.Cookies["JWTToken"];

    if (!string.IsNullOrEmpty(token) &&
        !context.Request.Headers.ContainsKey("Authorization"))
    {
        context.Request.Headers.Add("Authorization", "Bearer " + token);
    }

    await next();
});


app.UseSession();

app.UseMiddleware<UrlRewriteMiddleware>();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "brands",
        pattern: "brands/{name?}",
        defaults: new { controller = "Brand", action = "GetByName" });
});

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
