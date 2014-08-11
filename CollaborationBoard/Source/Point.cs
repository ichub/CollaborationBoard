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
        public int X { get; private set; }

        [DataMember(Name="y")]
        public int Y { get; private set; }

        public Point(int x, int y)
        {
            this.X = x;
            this.Y = y;
        }

        public Point()
        {
        }
    }
}