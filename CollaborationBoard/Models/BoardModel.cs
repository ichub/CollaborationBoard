using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace CollaborationBoard
{
    [DataContract]
    public class BoardModel
    {
        [DataMember]
        public string Id { get; set; }

        public BoardModel(string id)
        {
            this.Id = id;
        }
    }
}