using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class BoardModel : IValidatableObject
    {
        public string Title { get; set; }
        public string Password { get; set; }
        public string PasswordRepeat { get; set; }
        public bool PasswordEnabled { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (this.Password != this.PasswordRepeat && this.PasswordEnabled)
            {
                yield return new ValidationResult("Passwords must match.");
            }
        }

        public BoardModel()
        {
        }

        public BoardModel(string title, string password, bool passwordEnabled)
        {
            this.Title = title;
            this.Password = this.PasswordRepeat = password;
            this.PasswordEnabled = passwordEnabled;
        }
    }
}