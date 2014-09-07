using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public static class UserRandomizer
    {
        private static readonly List<string> colors;
        private static readonly List<string> names;

        static UserRandomizer()
        {
            colors = new List<Color>()
            {
                Color.Yellow,
                Color.FromArgb(155, 0, 155),
                Color.FromArgb(217, 114, 201),
                Color.FromArgb(114, 217, 201),
                Color.FromArgb(219, 175, 82),
                Color.FromArgb(219, 114, 201),
                Color.FromArgb(217, 82, 82),
                Color.FromArgb(101, 82, 219),
                Color.FromArgb(82, 140, 219),
            }.Select(color => color.ToRGBString()).ToList();

            names = new List<string>()
            {
                "Constitution",
                "Bill of Rights",
                "Anonymous",
                "Proletariat",
            };
        }

        public static void RandomizeUser(string boardId, User user)
        {
            user.DisplayColor = RandomColor(boardId);
            user.DisplayName = RandomName(boardId);
        }

        private static string RandomColor(string boardId)
        {
            List<string> taken = UserManager.GetBoardUsers(boardId).Select(a => a.DisplayColor).ToList();

            List<string> notTaken = colors.Where(a => !taken.Contains(a)).ToList();

            string color = notTaken.Count > 0 ? notTaken.TakeRandom() : taken.TakeRandom();

            return color;
        }

        private static string RandomName(string boardId)
        {
            List<string> taken = UserManager.GetBoardUsers(boardId).Select(a => a.DisplayName).ToList();

            List<string> notTaken = names.Where(a => !taken.Contains(a)).ToList();

            string name = notTaken.Count > 0 ? notTaken.TakeRandom() : taken.TakeRandom();
            return name;
        }
    }
}