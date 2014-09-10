using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class User
    {
        [IgnoreDataMember]
        public bool IsConnectedToServer
        {
            get
            {
                return this.connectionIds.Count > 0;
            }
        }

        [DataMember(Name = "id")]
        public string Id { get; private set; }

        [DataMember(Name = "boardId")]
        public string BoardId
        {
            get
            {
                return this.boardId;
            }
        }

        [DataMember(Name = "displayName")]
        public string DisplayName { get; set; }

        [DataMember(Name = "displayColor")]
        public string DisplayColor { get; set; }

        [IgnoreDataMember]
        public IReadOnlyList<string> ConnectionIds
        {
            get
            {
                return this.connectionIds;
            }
        }

        [IgnoreDataMember]
        public string SessionId { get; set; }

        [IgnoreDataMember]
        private List<string> connectionIds;

        [IgnoreDataMember]
        private string boardId;

        public User(string connectionId, string boardId, string sessionId)
        {
            this.Id = Guid.NewGuid().ToString();
            this.connectionIds = new List<string>();

            this.connectionIds.Add(connectionId);
            this.boardId = boardId;
            this.SessionId = sessionId;
        }

        public void AddConnection(string connectionId)
        {
            if (!this.connectionIds.Contains(connectionId))
            {
                this.connectionIds.Add(connectionId);
            }
        }

        public void RemoveConnection(string connectionId)
        {
            if (this.connectionIds.Contains(connectionId))
            {
                this.connectionIds.Remove(connectionId);
            }
        }

        public bool HasConnection(string connectionId)
        {
            return this.connectionIds.Contains(connectionId);
        }

        public bool TrySetBoard(string boardId)
        {
            if (UserManager.TryMoveUserToBoard(this.Id, boardId))
            {
                this.boardId = boardId;

                return true;
            }

            return false;
        }
    }
}