using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public static class Extensions
    {
        public static string String(this Random random, int length)
        {
            // http://stackoverflow.com/questions/1344221/how-can-i-generate-random-alphanumeric-strings-in-c

            var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new String(
                Enumerable.Repeat(chars, length)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());
        }
    }
}