using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public static class UserRandomizer
    {
        private static readonly List<Color> colors;
        private static readonly List<string> names;

        static UserRandomizer()
        {
            colors = new List<Color>()
            {
                Color.Yellow,
                Color.Red,
                Color.Green
            };

            names = new List<string>()
            {
                "Square",
                "Tree",
                "Stumpy",
                "Bub",
            };
        }

        public static void RandomizeUser(string boardId, User user)
        {
            user.DisplayColor = RandomColor(boardId);
            user.DisplayName = RandomName(boardId);
        }

        private static Color RandomColor(string boardId)
        {
            List<Color> taken = UserManager.GetBoardUsers(boardId).Select(a => a.DisplayColor).ToList();

            List<Color> notTaken = colors.Where(a => !taken.Contains(a)).ToList();

            Color color = notTaken.Count > 0 ? notTaken.TakeRandom() : taken.TakeRandom();
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