using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Exceptionless;

namespace CollaborationBoard
{
    public class LoggingPipelineModule : HubPipelineModule
    {
        protected override void OnIncomingError(ExceptionContext exceptionContext, IHubIncomingInvokerContext invokerContext)
        {
            exceptionContext.Error.ToExceptionless().Submit();
        }
    }
}