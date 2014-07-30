using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class DrawAction : BoardAction
    {
        public List<Point> Points { get; private set; }

        public DrawAction(string user, List<Point> points)
            : base(user)
        {
            this.Points = points;
        }
    }
}