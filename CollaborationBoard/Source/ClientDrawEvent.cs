﻿using System;
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

        [DataMember(Name = "point")]
        public Point Point { get; private set; }

        [DataMember(Name = "lastPoint")]
        public Point LastPoint { get; private set; }

        [DataMember(Name = "type")]
        public int EventType { get; private set; }

        public ClientDrawEvent()
        {
        }
    }
}