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
            User current = UserManager.GetUser(Context.ConnectionId);
            IEnumerable<string> onSameBoard = UserManager.GetBoardUserIdsExcept(current.BoardId, Context.ConnectionId);

            var clients = Clients.Clients(onSameBoard.ToList());
            clients.draw(Context.ConnectionId, x1, y1, x2, y2);
        }

        public void Handshake(string boardId)
        {
            var newUser = new User(Context.ConnectionId, boardId);

            UserManager.AddUser(boardId, newUser);

            Clients.Caller.handshake();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            UserManager.TryRemoveUser(Context.ConnectionId);

            return base.OnDisconnected(stopCalled);
        }
    }
}