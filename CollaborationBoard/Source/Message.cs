using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class Message
    {
        [DataMember(Name = "text")]
        public string Text { get; private set; }

        [DataMember(Name = "sender")]
        public string Sender { get; set; }

        [DataMember(Name = "color")]
        public string Color { get; set; }
    }
}