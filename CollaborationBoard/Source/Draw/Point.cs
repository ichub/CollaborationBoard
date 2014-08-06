using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class Point
    {
        public double X { get; private set; }
        public double Y { get; private set; }

        public Point(double x, double y)
        {
            this.X = x;
            this.Y = y;
        }

        public Point()
        {
        }
    }
}