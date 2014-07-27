using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class BoardModel
    {
        string Id { get; set; }

        public BoardModel(string id)
        {
            this.Id = id;
        }
    }
}