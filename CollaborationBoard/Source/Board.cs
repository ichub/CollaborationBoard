using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CollaborationBoard
{
    public class Board
    {
        private List<ClientDrawEvent> events;

        public IReadOnlyCollection<ClientDrawEvent> Events
        {
            get
            {
                return this.events;
            }
        }

        public string Id { get; private set; }
        public string Name { get; private set; }

        public Board(string id)
        {
            this.Id = id;
            this.events = new List<ClientDrawEvent>();
        }

        public Board(string id, string name)
            : this(id)
        {
            this.Name = name;
        }

        public void AppendEvent(ClientDrawEvent e)
        {
            this.events.Add(e);
        }
    }
}
