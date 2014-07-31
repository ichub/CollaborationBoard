using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CollaborationBoard
{
    public class Board
    {
        public string Name { get; set; }
        public List<ActionGroup> ActionGroups { get; set; }

        public Board(string name = "Untitled")
        {
            this.ActionGroups = new List<ActionGroup>();
            this.Name = name;
        }

        public SyncResponseModel Sync(ActionGroup group, int lastSync)
        {
            lock (this)
            {
                var result = this.ActionGroups.Skip(lastSync);

                this.ActionGroups.Add(group);

                return new SyncResponseModel(result.ToList(), this.ActionGroups.Count);
            }
        }
    }
}
