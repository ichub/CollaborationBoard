using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CollaborationBoard
{
    [DataContract]
    public abstract class Entity
    {
        [DataMember(Name = "id")]
        public string Id { get; private set; }

        [DataMember(Name = "position")]
        public Point Position { get; set; }

        public Entity(string id, Point position)
        {
            this.Id = id;
            this.Position = position;
        }
    }

    [DataContract]
    public class TextEntity : Entity
    {
        [DataMember(Name = "text")]
        public string Text { get; set; }

        public TextEntity(string id, Point position)
            : base(id, position)
        {

        }
    }
}
