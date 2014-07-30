using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CollaborationBoard
{
    public class Board
    {
        public string Name { get; set; }
        private List<BoardAction> actions { get; set; }

        public Board(string name = "Untitled")
        {
            this.actions = new List<BoardAction>();
            this.Name = name;
        }

        public List<BoardAction> GetActionsSince(int actionNumber)
        {
            return this.actions.Skip(actionNumber).ToList();
        }

        public void AddActions(List<BoardAction> actions)
        {
            this.actions.AddRange(actions);
        }
    }
}
