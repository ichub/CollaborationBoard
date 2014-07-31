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

        private object locker = new object();

        public Board(string name = "Untitled")
        {
            this.ActionGroups = new List<ActionGroup>();
            this.Name = name;
        }

        public SyncResponseModel Sync(ActionGroup group, int lastSync)
        {
            lock (locker)
            {
                var result = this.ActionGroups.Skip(lastSync);

                if (!group.Empty)
                {
                    this.ActionGroups.Add(group);
                }

                return new SyncResponseModel(result.ToList(), this.ActionGroups.Count);
            }
        }
    }
}
