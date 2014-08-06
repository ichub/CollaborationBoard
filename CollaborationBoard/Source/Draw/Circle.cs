using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class Circle
    {
        [DataMember(Name="position")]
        public Point Position { get; private set; }

        [DataMember(Name = "radius")]
        public double Radius { get; private set; }

        public Circle(Point position, double radius)
        {
            this.Position = position;
            this.Radius = radius;
        }

        public Circle()
        {
        }
    }
}