using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace CollaborationBoard
{
    public class BoardHub : Hub
    {
        public void Ping(string text)
        {
            Clients.All.ping(text);
        }
    }
}