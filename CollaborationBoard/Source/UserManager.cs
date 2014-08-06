using System;
using System.Collections.Generic;
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

        public static User GetUser(string connectionId)
        {
            foreach (var pair in users)
            {
                User user = pair.Value.Find(a => a.ConnectionId == connectionId);

                if (user != null)
                {
                    return user;
                }
            }

            return null;
        }

        public static bool TryRemoveUser(string connectionId)
        {
            foreach (var pair in users)
            {
                int index = pair.Value.FindIndex(user => user.ConnectionId == connectionId);

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

        public static IEnumerable<User> GetBoardUsersExcept(string boardId, string exceptConnectionId)
        {
            return GetBoardUsers(boardId).Where(user => user.ConnectionId != exceptConnectionId);
        }

        public static IEnumerable<string> GetBoardUserIds(string boardId)
        {
            return GetBoardUsers(boardId).Select(user => user.ConnectionId);
        }

        public static IEnumerable<string> GetBoardUserIdsExcept(string boardId, string exceptConnectionId)
        {
            return GetBoardUsersExcept(boardId, exceptConnectionId).Select(user => user.ConnectionId);

        }
    }
}