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
        [DataMember(Name="cid")]
        public string ConnectionId { get; private set; }

        [DataMember(Name = "boardId")]
        public string BoardId { get; private set; }

        [DataMember(Name = "displayName")]
        public string DisplayName { get; set; }

        [DataMember(Name = "displayColor")]
        public string DisplayColor { get; set; }

        public User(string connectionId, string boardId)
        {
            this.ConnectionId = connectionId;
            this.BoardId = boardId;
        }
    }
}