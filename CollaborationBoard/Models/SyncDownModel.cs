using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class SyncDownModel
    {
        public List<BoardAction> Actions { get; private set; }

        public SyncDownModel(List<BoardAction> actions)
        {
            this.Actions = actions;
        }
    }
}