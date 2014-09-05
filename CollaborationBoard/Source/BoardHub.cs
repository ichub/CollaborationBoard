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
        public void AddMessage(Message message)
        {
            var context = new RequestContext(this);

            message.Sender = context.Caller.ConnectionId;

            context.NeighborClients.addMessage(message);
        }

        public void AddTextEntity(TextEntity entity)
        {
            var context = new RequestContext(this);

            context.Board.AddEntity(entity);

            context.NeighborClients.addTextEntity(entity);
        }

        public void EntityMove(string id, Point position)
        {
            var context = new RequestContext(this);

            context.Board.SetEntityPosition(id, position);

            context.NeighborClients.entityMove(id, position);
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

            Clients.Caller.handshake(context.Caller.ConnectionId, new BoardSnapshot(context.Board));

            context.NeighborClients.connect(newUser.ConnectionId);

            if (BoardManager.IsBoardScheduledForDeletion(boardId))
            {
                BoardManager.CancelBoardDeletion(boardId);
            }
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var context = new RequestContext(this);

            UserManager.TryRemoveUser(Context.ConnectionId);

            context.NeighborClients.disconnect(Context.ConnectionId);

            if (context.Board.IsEmpty)
            {
                BoardManager.ScheduleBoardDeletion(TimeSpan.FromMinutes(5), context.Board.Id);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}