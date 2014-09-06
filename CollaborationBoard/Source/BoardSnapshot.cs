using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class BoardSnapshot
    {
        [DataMember(Name = "textEntities")]
        public IReadOnlyList<TextEntity> TextEntities { get; private set; }

        [DataMember(Name = "events")]
        public IReadOnlyList<ClientDrawEvent> Events { get; private set; }

        [DataMember(Name = "neighbors")]
        public IReadOnlyList<string> Neighbors { get; private set; }

        [DataMember(Name = "messages")]
        public IReadOnlyList<Message> Messages { get; private set; }

        [DataMember(Name = "displayColor")]
        public string DisplayColor { get; set; }

        [DataMember(Name = "displayName")]
        public string DisplayName { get; set; }

        public BoardSnapshot(Board board)
        {
            var entities = board.Entities;

            this.TextEntities = entities.Where(a => a is TextEntity).Select(a => a as TextEntity).ToList();
            this.Events = board.Events;
            this.Neighbors = UserManager.GetBoardUserIds(board.Id).ToList();
            this.Messages = board.Messages;

            this.DisplayColor = "white";
            this.DisplayName = "user";
        }
    }
}