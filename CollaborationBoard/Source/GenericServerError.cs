using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public class GenericServerError
    {
        public string Output { get; private set; }

        public GenericServerError(string output)
        {
            this.Output = output;
        }
    }
}