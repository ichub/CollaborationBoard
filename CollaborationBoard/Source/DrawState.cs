using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class DrawState
    {
        public List<Line> Lines { get; private set; }

        public DrawState()
        {
            this.Lines = new List<Line>();
        }

        public void AddLine(Line line)
        {
            this.Lines.Add(line);
        }
    }
}