using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class DrawState
    {
        [DataMember(Name="lines")]
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