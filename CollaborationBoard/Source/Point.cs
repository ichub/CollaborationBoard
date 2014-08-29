using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class Point
    {
        [DataMember(Name="x")]
        public double X { get; private set; }

        [DataMember(Name="y")]
        public double Y { get; private set; }
    }
}