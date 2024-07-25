using Food_Delivery_MVC.Helpers;
using Food_Delivery_MVC.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Food_Delivery_MVC.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public void Send(string to, string subject, string html, string from = null)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from ?? _emailSettings.FromAddress));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = html
            };

            //email.Body = new TextPart(TextFormat.Html) { Text = html };
            email.Body = bodyBuilder.ToMessageBody();

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect(_emailSettings.Server, _emailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_emailSettings.UserName, _emailSettings.Password);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}
