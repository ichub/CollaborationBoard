using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CollaborationBoard
{
    public class Board
    {
        public string Id { get; private set; }
        public string Name { get; private set; }

        public Board(string id)
        {
            this.Id = id;
        }
    }
}
