﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CollaborationBoard
{
    public class Board
    {
        public DrawState DrawState { get; private set; }
        public string Id { get; private set; }
        public string Name { get; private set; }

        public Board(string id)
        {
            this.DrawState = new DrawState();
            this.Id = id;
        }

        public Board(string id, string name)
            : this(id)
        {
            this.Name = name;
        }
    }
}