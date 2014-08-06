using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class RequestContext
    {
        public User Caller { get; private set; }
        public IList<User> Neighbors { get; private set; }
        public IList<string> NeighborIds { get; private set; }
        public Board Board { get; private set; }

        public RequestContext(BoardHub hub)
        {
            this.Caller = UserManager.GetUser(hub.Context.ConnectionId);
            this.Board = BoardManager.GetBoard(this.Caller.BoardId);
            this.Neighbors = UserManager.GetBoardUsersExcept(this.Caller.BoardId, this.Caller.ConnectionId).ToList();
            this.NeighborIds = this.Neighbors.Select(a => a.ConnectionId).ToList();
        }
    }
}