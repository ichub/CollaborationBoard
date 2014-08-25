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
        public void AddTextEntity(TextEntity entity)
        {
            var context = new RequestContext(this);

            context.Board.AddTextEntity(entity);

            context.NeighborClients.addTextEntity(entity);
        }

        public void TextEntityMove(string id, Point position)
        {
            var context = new RequestContext(this);

            context.Board.SetEntityPosition(id, position);

            context.NeighborClients.textEntityMove(id, position);
        }

        public void TextEntityUpdateText(string id, string text)
        {
            var context = new RequestContext(this);

            context.Board.SetTextEntityText(id, text);

            context.NeighborClients.textEntityUpdateText(id, text);
        }

        public void OnDrawEvent(ClientDrawEvent e)
        {
            var context = new RequestContext(this);
            context.Board.AppendEvent(e);

            e.Sender = context.Caller.ConnectionId;

            context.NeighborClients.onDrawEvent(e);
        }

        public void OnMouseMove(double x, double y)
        {
            var context = new RequestContext(this);

            context.NeighborClients.onMouseMove(context.Caller.ConnectionId, x, y);
        }

        public void Handshake(string boardId)
        {
            var newUser = new User(Context.ConnectionId, boardId);

            UserManager.AddUser(boardId, newUser);

            var context = new RequestContext(this);
            var actions = context.Board.Events;

            Clients.Caller.handshake(context.Caller.ConnectionId, context.NeighborIds, actions);

            context.NeighborClients.connect(newUser.ConnectionId);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var context = new RequestContext(this);

            UserManager.TryRemoveUser(Context.ConnectionId);

            context.NeighborClients.disconnect(Context.ConnectionId);

            return base.OnDisconnected(stopCalled);
        }
    }
}