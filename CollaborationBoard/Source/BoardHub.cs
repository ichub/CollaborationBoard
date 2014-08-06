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
        public void DrawLine(Point first, Point second)
        {
            var context = new RequestContext(this);
            var clients = Clients.Clients(context.NeighborIds);

            context.Board.DrawState.AddLine(new Line(first, second));

            clients.drawLine(first, second);
        }

        public void DrawCircle(Point position, double radius)
        {
            var context = new RequestContext(this);
            var clients = Clients.Clients(context.NeighborIds);

            context.Board.DrawState.AddCircle(new Circle(position, radius));
            clients.drawCircle(position, radius);
        }

        public void Handshake(string boardId)
        {
            var newUser = new User(Context.ConnectionId, boardId);

            UserManager.AddUser(boardId, newUser);

            Clients.Caller.handshake();
        }

        public void GetState()
        {
            User user = UserManager.GetUser(Context.ConnectionId);

            Board board = BoardManager.GetBoard(user.BoardId);

            Clients.Caller.state(board.DrawState);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            UserManager.TryRemoveUser(Context.ConnectionId);

            return base.OnDisconnected(stopCalled);
        }
    }
}