using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CollaborationBoard
{
    public class Board
    {
        private List<ClientDrawEvent> events;

        public IReadOnlyList<ClientDrawEvent> Events
        {
            get
            {
                return this.events;
            }
        }

        private Dictionary<string, Entity> entities;

        public IReadOnlyList<Entity> Entities
        {
            get
            {
                return this.entities.Select(a => a.Value).ToList();
            }
        }

        public string Id { get; private set; }
        public string Name { get; private set; }

        public Board(string id)
        {
            this.Id = id;
            this.events = new List<ClientDrawEvent>();
            this.entities = new Dictionary<string, Entity>();
        }

        public Board(string id, string name)
            : this(id)
        {
            this.Name = name;
        }

        private T FindEntity<T>(string id) where T : Entity
        {
            return this.FindEntity(id) as T;
        }

        private Entity FindEntity(string id)
        {
            if (this.entities.ContainsKey(id))
            {
                return this.entities[id];
            }

            return null;
        }

        public void AppendEvent(ClientDrawEvent e)
        {
            this.events.Add(e);
        }

        public void AddEntity(Entity entity)
        {
            this.entities.Add(entity.Id, entity);
        }

        public void SetEntityPosition(string id, Point position)
        {
            this.FindEntity(id).Position = position;
        }

        public void SetTextEntityText(string id, string text)
        {
            this.FindEntity<TextEntity>(id).Text = text;
        }
    }
}
