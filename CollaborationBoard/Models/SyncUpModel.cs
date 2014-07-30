using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    public class SyncUpModel
    {
        public List<BoardAction> Actions { get; set; }
    }
}