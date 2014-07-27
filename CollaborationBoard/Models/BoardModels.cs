using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    public class NewBoardModel
    {
        public string Id { get; set; }

        public NewBoardModel(string id)
        {
            this.Id = id;
        }
    }
}