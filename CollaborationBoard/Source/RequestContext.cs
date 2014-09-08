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
        public dynamic NeighborClients { get; private set; }
        public Board Board { get; private set; }

        public RequestContext(BoardHub hub)
        {
            this.Caller = UserManager.GetUserByConnection(hub.Context.ConnectionId);
            this.Board = BoardManager.GetBoard(this.Caller.BoardId);

            var neighborIds = UserManager.GetUserIds(this.Board.Id).Where(a => a != hub.Context.ConnectionId);

            this.NeighborClients = hub.Clients.Clients(neighborIds.ToList());
        }
    }
}