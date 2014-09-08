using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public static class UserManager
    {
        private static Dictionary<string, List<User>> users;

        static UserManager()
        {
            users = new Dictionary<string, List<User>>();
        }

        private static List<User> GetAllUsers()
        {
            return users.Select(a => a.Value).SelectMany(a => a).ToList();
        }

        public static User GetUserBySession(string sessionId)
        {
            return GetAllUsers().Where(a => a.SessionId == sessionId).FirstOrDefault();
        }

        public static User GetUserByConnection(string connectionId)
        {
            return GetAllUsers().Where(a => a.HasConnection(connectionId)).FirstOrDefault();
        }

        public static bool TryRemoveUser(string connectionId)
        {
            foreach (var pair in users)
            {
                int index = pair.Value.FindIndex(user => user.HasConnection(connectionId));

                if (index >= 0)
                {
                    pair.Value.RemoveAt(index);
                    return true;
                }
            }

            return false;
        }

        public static void AddUser(string boardId, User user)
        {
            if (!users.ContainsKey(boardId))
            {
                users.Add(boardId, new List<User>());
            }

            UserRandomizer.RandomizeUser(boardId, user);

            users[boardId].Add(user);
        }

        public static IEnumerable<User> GetBoardUsers(string boardId)
        {
            if (users.ContainsKey(boardId))
            {
                return users[boardId];
            }

            return null;
        }

        public static IEnumerable<string> GetUserIds(string boardId)
        {
            return GetBoardUsers(boardId)
                .SelectMany(a => a.ConnectionIds);
        }
    }
}