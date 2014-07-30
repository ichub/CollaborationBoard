using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class BoardAction
    {
        public string User { get; set; }

        public BoardAction(string user)
        {
            this.User = user;
        }
    }
}