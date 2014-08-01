using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class SocketUser
    {
        public string ConnectionId { get; private set; }
        public string BoardId { get; set; }

        public SocketUser(string id)
        {
            this.ConnectionId = id;
        }
    }
}