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
        public static ConcurrentDictionary<string, SocketUser> Users { get; private set; }

        static BoardHub()
        {
            Users = new ConcurrentDictionary<string, SocketUser>();
        }

        public void Draw(float x1, float y1, float x2, float y2)
        {
            Clients.All.draw(Context.ConnectionId, x1, y1, x2, y2);
        }

        public void RegisterBoard(string board)
        {
            Clients.Caller.onRegister(board);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            SocketUser user;

            Users.TryRemove(Context.ConnectionId, out user);

            return base.OnDisconnected(stopCalled);
        }

        public override Task OnConnected()
        {
            Users.TryAdd(Context.ConnectionId, new SocketUser(Context.ConnectionId));

            return base.OnConnected();
        }
    }
}