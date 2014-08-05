using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace CollaborationBoard
{
    public class BoardHub : Hub
    {
        public void Draw(float x1, float y1, float x2, float y2)
        {
            Clients.All.draw(Context.ConnectionId, x1, y1, x2, y2);
        }
    }
}