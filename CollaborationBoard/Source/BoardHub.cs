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
        public void OnDrawEvent(int type, double x, double y)
        {
            var context = new RequestContext(this, Clients);

            context.NeighborClients.onDrawEvent(context.Caller.ConnectionId, type, x, y);
        }

        public void OnMouseMove(double x, double y)
        {
            var context = new RequestContext(this, Clients);

            context.NeighborClients.onMouseMove(context.Caller.ConnectionId, x, y);
        }

        public void Handshake(string boardId)
        {
            var newUser = new User(Context.ConnectionId, boardId);

            UserManager.AddUser(boardId, newUser);

            var context = new RequestContext(this, Clients);

            Clients.Caller.handshake(context.NeighborIds);

            context.NeighborClients.connect(newUser.ConnectionId);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            UserManager.TryRemoveUser(Context.ConnectionId);

            return base.OnDisconnected(stopCalled);
        }
    }
}