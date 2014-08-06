using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class Line
    {
        [DataMember(Name="first")]
        public Point First { get; private set; }

        [DataMember(Name = "second")]
        public Point Second { get; set; }

        public Line(Point first, Point second)
        {
            this.First = first;
            this.Second = second;
        }

        public Line()
        {
        }
    }
}