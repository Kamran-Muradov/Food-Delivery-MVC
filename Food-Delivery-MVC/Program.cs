using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.Services;
using Food_Delivery_MVC.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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

//builder.Services.AddSession(options =>
//{
//    options.Cookie.Name = "Food-Delivery-MVC.Session";
//    options.IdleTimeout = TimeSpan.FromMinutes(30);
//    options.Cookie.HttpOnly = true;
//    options.Cookie.IsEssential = true;
//});

//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//    .AddCookie(options =>
//    {
//        options.Cookie.Name = "Food-Delivery.AuthCookie";
//        options.Cookie.HttpOnly = true;
//        options.Cookie.IsEssential = true;
//        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
//        options.SlidingExpiration = true;
//        options.Cookie.SameSite = SameSiteMode.Strict;
//    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

//app.UseSession();

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

app.UseAuthentication();

app.UseAuthorization();


app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
