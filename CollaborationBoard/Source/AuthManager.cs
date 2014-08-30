using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public static class AuthManager
    {
        private static Dictionary<string, List<string>> userAuths;

        static AuthManager()
        {
            userAuths = new Dictionary<string, List<string>>();
        }

        public static bool IsSessionInitialized(string sessionId)
        {
            return userAuths.ContainsKey(sessionId);
        }

        public static void InitializeSession(string sessionId)
        {
            userAuths.Add(sessionId, new List<string>());
        }

        public static bool IsUserAuthenticated(string sessionId, string boardId)
        {
            if (IsSessionInitialized(sessionId))
            {
                return userAuths[sessionId].Contains(boardId);
            }

            return false;
        }

        public static void AuthenticateUser(string sessionId, string boardId)
        {
            if (IsSessionInitialized(sessionId))
            {
                if (!userAuths[sessionId].Contains(boardId))
                {
                    userAuths[sessionId].Add(boardId);
                    return;
                }

                throw new ArgumentException("Session already authenticated for this board");
            }

            throw new ArgumentException("Session was not initialized.");
        }
    }
}