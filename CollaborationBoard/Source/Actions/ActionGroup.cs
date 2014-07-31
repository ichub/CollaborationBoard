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
        public List<Line> Lines { get; set; }

        public bool Empty
        {
            get
            {
                return this.Messages.Count == 0 && this.Lines.Count == 0;
            }
        }

        public ActionGroup()
        {
            this.Messages = new List<Message>();
            this.Lines = new List<Line>();
        }
    }
}