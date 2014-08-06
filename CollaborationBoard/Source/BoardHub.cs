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
        public void Draw(Point first, Point second)
        {
            User current = UserManager.GetUser(Context.ConnectionId);
            IEnumerable<string> onSameBoard = UserManager.GetBoardUserIdsExcept(current.BoardId, Context.ConnectionId);

            var clients = Clients.Clients(onSameBoard.ToList());

            Board board = BoardManager.GetBoard(current.BoardId);

            board.DrawState.AddLine(new Line(first, second));

            clients.draw(first, second);
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