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
            message.SenderName = context.Caller.DisplayName;

            context.Board.AddMessage(message);

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
            string sessionId = Context.RequestCookies["ASP.NET_SessionId"].Value;

            var user = UserManager.GetUserBySession(sessionId);

            if (user != null)
            {
                UserManager.MoveUserToBoard(user.ConnectionId, boardId);

                FinalizeHandshake(boardId, user);

                return;
            }

            var newUser = new User(Context.ConnectionId, boardId, sessionId);

            UserManager.AddUser(boardId, newUser);

            FinalizeHandshake(boardId, newUser);
        }

        private void FinalizeHandshake(string boardId, User user)
        {
            var context = new RequestContext(this);
            var actions = context.Board.Events;

            var snapshot = new BoardSnapshot(context.Board);

            Clients.Caller.handshake(context.Caller, snapshot);

            context.NeighborClients.connect(user);

            if (BoardManager.IsBoardScheduledForDeletion(boardId))
            {
                BoardManager.CancelBoardDeletion(boardId);
            }
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var context = new RequestContext(this);

            //UserManager.TryRemoveUser(Context.ConnectionId);

            context.NeighborClients.disconnect(context.Caller);

            if (context.Board.IsEmpty)
            {
                BoardManager.ScheduleBoardDeletion(TimeSpan.FromMinutes(5), context.Board.Id);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}