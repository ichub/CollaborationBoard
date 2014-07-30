using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class ActionGroup
    {
        [DataMember(Name = "user")]
        public string User { get; set; }

        [DataMember(Name = "messages")]
        public List<Message> Messages { get; set; }

        [DataMember(Name = "lines")]
        public List<LineCollection> Lines { get; set; }

        public ActionGroup()
        {
            this.Messages = new List<Message>();
            this.Lines = new List<LineCollection>();
        }
    }
}