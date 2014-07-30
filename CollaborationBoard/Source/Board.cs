using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CollaborationBoard
{
    public class Board
    {
        public string Name { get; set; }

        public Board(string name = "Untitled")
        {
            this.Name = name;
        }
    }
}
