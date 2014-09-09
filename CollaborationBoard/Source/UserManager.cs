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

        public static User GetUserById(string userId)
        {
            return GetAllUsers().Where(a => a.Id == userId).FirstOrDefault();
        }

        public static bool IsUserOnBoard(string userId, string boardId)
        {
            if (users.ContainsKey(boardId))
            {
                return users[boardId].Where(a => a.Id == userId).Count() > 0;
            }

            return false;
        }

        public static bool TryMoveUserToBoard(string userId, string newBoardId)
        {
            if (!IsUserOnBoard(userId, newBoardId))
            {
                User user = GetUserById(userId);

                foreach (var pair in users)
                {
                    if (pair.Value.Contains(user))
                    {
                        pair.Value.Remove(user);

                        users[newBoardId].Add(user);

                        return true;
                    }
                }
            }

            return false;
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

        public static void AddUser(User user)
        {
            if (!users.ContainsKey(user.BoardId))
            {
                users.Add(user.BoardId, new List<User>());
            }

            UserRandomizer.RandomizeUser(user.BoardId, user);

            users[user.BoardId].Add(user);
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