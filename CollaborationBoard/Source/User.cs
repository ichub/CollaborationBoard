using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class User
    {
        public string ConnectionId { get; private set; }
        public string BoardId { get; private set; }
        
        public User(string connectionId, string boardId)
        {
            this.ConnectionId = connectionId;
            this.BoardId = boardId;
        }
    }
}