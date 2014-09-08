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
        [DataMember(Name = "id")]
        public string Id { get; private set; }

        [DataMember(Name = "boardId")]
        public string BoardId { get; set; }

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

        public User(string connectionId, string boardId, string sessionId)
        {
            this.Id = new Guid().ToString();
            this.connectionIds = new List<string>();

            this.connectionIds.Add(connectionId);
            this.BoardId = boardId;
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
    }
}