﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class SyncResponseModel
    {
        public List<ActionGroup> Actions { get; set; }

        public bool Empty
        {
            get
            {
                return this.Actions.Count == 0;
            }
        }

        public int LastSync { get; set; }

        public SyncResponseModel(List<ActionGroup> actions, int lastSync)
        {
            this.Actions = actions;
            this.LastSync = lastSync;
        }
    }
}