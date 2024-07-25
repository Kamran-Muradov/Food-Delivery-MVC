using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Food_Delivery_MVC.Helpers.Account
{
    public class AccountUtil
    {
        public static List<string> GetUserRoles(string token)
        {
            JwtSecurityTokenHandler tokenHandler = new();
            JwtSecurityToken securityToken = (JwtSecurityToken)tokenHandler.ReadToken(token);
            IEnumerable<Claim> claims = securityToken.Claims;

            return claims.Where(m => m.Type == ClaimTypes.Role).Select(m => m.Value).ToList();
        }

        public static string GetUserName(string token)
        {
            JwtSecurityTokenHandler tokenHandler = new();
            JwtSecurityToken securityToken = (JwtSecurityToken)tokenHandler.ReadToken(token);
            IEnumerable<Claim> claims = securityToken.Claims;

            return claims.FirstOrDefault(m => m.Type == "sub").Value;
        }
    }
}
