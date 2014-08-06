using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class Line
    {
        public Point First { get; private set; }
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