using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class ClientDrawEvent
    {
        [DataMember(Name = "cid")]
        public string Sender { get; set; }

        [DataMember(Name = "x")]
        public int X { get; set; }

        [DataMember(Name = "y")]
        public int Y { get; set; }

        [DataMember(Name = "type")]
        public int EventType { get; set; }

        public ClientDrawEvent()
        {
        }
    }
}